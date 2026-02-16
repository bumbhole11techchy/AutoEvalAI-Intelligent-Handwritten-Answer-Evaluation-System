import os
import re
import json

from backend.services.language_validator import detect_language_type
from backend.services.embedding_service import get_embedding
from backend.services.llm_client import call_llm


# -------------------- FALLBACK QUESTION GEN -------------------- #
def _deterministic_context_questions(context: str, language: str, num_questions: int):
    sentences = re.split(r"[.।]\s*", context)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    questions = []

    for s in sentences:
        if len(questions) >= num_questions:
            break

        if language == "english":
            questions.append(f"Explain the following statement: {s}.")
        else:
            questions.append(f"निम्नलिखित कथन की व्याख्या करें: {s}।")

    # 🔥 Ensure exact count even if context has fewer sentences
    while len(questions) < num_questions:
        if language == "english":
            questions.append("Explain an important concept from the context in detail.")
        else:
            questions.append("संदर्भ से किसी महत्वपूर्ण अवधारणा को विस्तार से समझाइए।")

    return questions


# -------------------- SAFE JSON PARSER -------------------- #
def _safe_json_parse(raw: str):
    try:
        raw = raw.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]

        return json.loads(raw)

    except Exception:
        return None


# -------------------- MAIN GENERATOR -------------------- #
def generate_questions(
    context: str,
    difficulty: str,
    num_questions: int = 10,
    language: str | None = None
):
    if not context or len(context.strip()) < 10:
        raise ValueError("Context must not be empty")

    if difficulty not in {"easy", "medium", "hard"}:
        raise ValueError("Difficulty must be easy, medium, or hard")

    if num_questions < 1 or num_questions > 50:
        raise ValueError("num_questions must be between 1 and 50")

    # 🔍 Detect language once
    if not language:
        language = detect_language_type(context)

    if language == "mixed":
        raise ValueError("Mixed language input is not allowed")

    MAX_MARKS_MAP = {"easy": 2, "medium": 5, "hard": 10}
    max_marks = MAX_MARKS_MAP[difficulty]

    result = []

    # ================== PRODUCTION MODE ================== #
    if os.getenv("ENV") == "production":
        questions = _deterministic_context_questions(
            context, language, num_questions
        )

        for q in questions:
            answer = context[:200]

            result.append({
                "question": q,
                "reference_answer": answer,
                "reference_embedding": get_embedding(answer),
                "difficulty": difficulty,
                "language": language,
                "max_marks": max_marks
            })

        return result

    # ================== LLM MODE ================== #
    if language == "english":
        prompt = f"""
You are an expert examiner.

You MUST generate EXACTLY {num_questions} {difficulty}-level questions 
with answers strictly derived from the context.

If the number of questions is not exactly {num_questions}, 
the output is INVALID.

Rules:
- Output ONLY valid JSON
- No markdown
- No explanation
- English only

Format:
[
  {{
    "question": "...",
    "answer": "..."
  }}
]

Context:
{context}
"""
    else:
        prompt = f"""
आप एक अनुभवी परीक्षक हैं।

आपको ठीक {num_questions} {difficulty} स्तर के प्रश्न और उत्तर बनाने हैं।
यदि प्रश्नों की संख्या {num_questions} से कम या अधिक हुई तो आउटपुट अमान्य माना जाएगा।

नियम:
- केवल JSON आउटपुट
- कोई अतिरिक्त टेक्स्ट नहीं
- हिंदी में ही उत्तर

Format:
[
  {{
    "question": "...",
    "answer": "..."
  }}
]

संदर्भ:
{context}
"""

    raw_output = call_llm(prompt)

    qa_pairs = _safe_json_parse(raw_output)

    # 🔥 If JSON failed → fallback
    if not qa_pairs or not isinstance(qa_pairs, list):
        qa_pairs = []

    # 🔥 Retry once if fewer questions returned
    if len(qa_pairs) < num_questions:
        missing = num_questions - len(qa_pairs)

        retry_prompt = f"""
Generate EXACTLY {missing} additional {difficulty}-level 
questions with answers from the same context.

Return ONLY JSON list.
"""

        retry_raw = call_llm(retry_prompt)
        retry_parsed = _safe_json_parse(retry_raw)

        if retry_parsed and isinstance(retry_parsed, list):
            qa_pairs.extend(retry_parsed)

    # 🔥 Final Guarantee: If still not enough → deterministic fill
    if len(qa_pairs) < num_questions:
        fallback_questions = _deterministic_context_questions(
            context, language, num_questions - len(qa_pairs)
        )

        for q in fallback_questions:
            qa_pairs.append({
                "question": q,
                "answer": context[:200]
            })

    # Trim if too many
    qa_pairs = qa_pairs[:num_questions]

    # ================== FINAL STRUCTURE ================== #
    for item in qa_pairs:
        question = item.get("question", "").strip()
        answer = item.get("answer", "").strip() or context[:200]

        result.append({
            "question": question,
            "reference_answer": answer,
            "reference_embedding": get_embedding(answer),
            "difficulty": difficulty,
            "language": language,
            "max_marks": max_marks
        })

    return result
