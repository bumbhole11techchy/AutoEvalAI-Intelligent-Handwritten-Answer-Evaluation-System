import os
import re

from backend.services.language_validator import detect_language_type
from backend.services.llm_client import call_llm


# -------------------- FALLBACK ANSWER -------------------- #
def _deterministic_answer(context: str, question: str, language: str) -> str:
    """
    Safe fallback when LLM is unavailable.
    Extracts key sentences from context.
    """
    sentences = re.split(r"[.।]\s*", context)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    selected = sentences[:3]

    if not selected:
        return context.strip()

    if language == "hindi":
        return "। ".join(selected) + "।"
    else:
        return ". ".join(selected) + "."


# -------------------- MAIN GENERATOR -------------------- #
def generate_ground_truth(context: str, question: str) -> str:
    if not context or not question:
        raise ValueError("Context and question must not be empty")

    language = detect_language_type(context)

    if language == "mixed":
        raise ValueError("Mixed language answers are not allowed")

    # 🔐 NO-LLM MODE (Render / Production)
    if os.getenv("ENV") == "production":
        return _deterministic_answer(context, question, language)

    # 🧠 LLM PROMPT
    if language == "english":
        prompt = f"""
You are a teacher.

Read the context carefully and answer the question.
Understand the meaning — do not copy lines.

Context:
{context}

Question:
{question}

Rules:
- Use only the given context
- Answer in your own words
- 2–4 clear lines
- No extra explanation
"""
    else:  # hindi
        prompt = f"""
आप एक शिक्षक हैं।

संदर्भ को समझकर प्रश्न का उत्तर दें।
वाक्यों की नकल न करें।

संदर्भ:
{context}

प्रश्न:
{question}

नियम:
- केवल दिए गए संदर्भ पर आधारित उत्तर
- 2–4 पंक्तियाँ
- स्पष्ट और तथ्यात्मक
"""

    try:
        answer = call_llm(prompt)

        if not answer or not answer.strip():
            return _deterministic_answer(context, question, language)

        return answer.strip()

    except Exception as e:
        # 🔥 HARD SAFETY FALLBACK
        print("⚠️ Ground truth LLM failed, using deterministic answer:", e)
        return _deterministic_answer(context, question, language)
