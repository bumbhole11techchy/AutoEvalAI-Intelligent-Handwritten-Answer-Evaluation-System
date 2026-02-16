# Multilingual Answer Evaluation System

An AI-powered **ML/DL project** that automatically evaluates user answers against reference answers **across languages (English & Hindi)** using semantic similarity. The system generates questions from a given context, accepts user responses, compares them with ground-truth answers, and ranks users based on answer similarity.

---

## 🚀 Project Overview

This project focuses on **automated answer evaluation** for descriptive answers, even when the **question, reference answer, and user answer are in different languages**.

### Key Capabilities

* 📄 Accepts **input context in English**
* ❓ Automatically **generates 3 questions** from the context
* ✍️ Users answer in **English or Hindi**
* 🌐 Uses **cross-lingual embeddings** to compare answers
* 📊 Scores and **ranks users** based on semantic similarity
* 🧠 Supports **ML + Deep Learning** models

---

## 🧠 System Architecture

```
Input Context (English)
        │
        ▼
Question Generation Model
        │
        ▼
Reference Answers (EN / HI)
        │
        ▼
User Answers (EN / HI)
        │
        ▼
Multilingual Encoder (DL)
        │
        ▼
Embedding Similarity (Cosine)
        │
        ▼
Scores + Ranking
```

---

## 🛠️ Tech Stack

### Machine Learning / AI

* Sentence Transformers (Multilingual)
* BERT / mBERT / XLM-R
* Cosine Similarity
* Question Generation Models (T5 / BART)

### Backend

* Python
* FastAPI
* Uvicorn

### Frontend

* React / Next.js
* Tailwind CSS

### Deployment

* Vercel (Frontend)
* Local / Cloud (Backend)

---

## 📂 Project Structure

```
ml-answer-evaluation/
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── services/
│   └── utils/
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── notebooks/
│   └── experiments.ipynb
│
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/projectbyghsx-png/ml-answer-evaluation.git
cd ml-answer-evaluation
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Example Use Case

1. Teacher uploads a **paragraph (English)**
2. System generates **3 conceptual questions**
3. Students answer in **English or Hindi**
4. AI evaluates answers semantically
5. Students receive **scores & rank**

---

## 📈 Evaluation Method

* Text → Multilingual Embeddings
* Similarity → Cosine Similarity
* Score Normalization → 0–100
* Ranking → Highest similarity first

---

## 🔮 Future Enhancements

* 📝 Handwritten answer evaluation (OCR)
* 🌍 More language support
* 📊 Teacher analytics dashboard
* 🤖 LLM-based feedback generation
* 🎯 Partial credit & keyword weighting

---

## 👥 Contributors

* **Projects byGSH** (Owner & Developer)

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you like this project, **give it a star ⭐ on GitHub** and feel free to contribute!

---

**Built with ❤️ for AI-driven education & evaluation**
