# JanAdhikar

### AI-Powered Multilingual Citizen Assistance Platform

JanAdhikar is a multilingual conversational assistant designed to simplify access to Indian government welfare schemes and legal guidance through a familiar WhatsApp-style experience.

Instead of navigating complex government portals, users can simply chat naturally in:

* English
* Hindi
* Hinglish

The platform helps users:

* discover welfare schemes
* understand eligibility
* ask legal questions
* upload documents
* interact using voice input
* receive conversational guidance

---

# ✨ Features

## 💬 Conversational WhatsApp-Style Interface

* Natural chat-based onboarding
* Mobile-first responsive UI
* Human-like interaction flow
* Context-aware follow-up questions

---

## 🌐 Multilingual Support

Supports:

* English
* Hindi
* Hinglish

Examples:

* “मुझे पेंशन चाहिए”
* “farmer hu”
* “income 5000”
* “widow hu”

---

## 🎙 Voice Input

* Browser-native speech recognition
* Hindi + English voice support
* Mobile-friendly voice interaction
* Conversational voice flow

---

## 📄 Document Upload

Supports lightweight upload flow for:

* Aadhaar card
* Ration card
* Income certificate
* Pension documents
* Disability certificates

---

## 🧠 Smart Scheme Recommendations

The assistant helps users discover:

* pension schemes
* farming support
* housing support
* healthcare schemes
* education assistance
* employment-related support

Includes:

* eligibility guidance
* required documents
* application support
* official links

---

## ⚖ Legal Guidance

Provides conversational legal-awareness assistance for:

* domestic violence
* harassment
* pension disputes
* welfare rights
* basic citizen rights

---

## 📱 Responsive Design

Optimized for:

* mobile phones
* tablets
* desktop presentations
* projector demos

---

## ⚡ Offline-First Architecture

Designed with lightweight local-first principles:

* local FastAPI backend
* local retrieval layer
* FAISS + NumPy fallback retrieval
* stable offline-friendly flow

---

# 🏗 Tech Stack

## Frontend

* React
* Vite
* CSS

## Backend

* FastAPI
* Python

## AI / Retrieval

* FAISS
* NumPy fallback retrieval
* conversational intelligence layer
* multilingual parsing

## Other

* Browser Speech Recognition API
* Responsive mobile-first UI

---

# 🧠 Architecture Overview

Frontend handles:

* conversational UI
* multilingual interaction
* voice input
* onboarding flow
* responsive experience

Backend handles:

* eligibility logic
* legal guidance
* retrieval
* recommendation processing
* contextual responses

The project intentionally uses a hybrid architecture:

* deterministic backend logic for reliability
* conversational intelligence for natural interaction

This reduces hallucination risk while keeping the experience human and conversational.

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPO_URL
cd janadhikar
```

---

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Backend Requirements

```bash
pip install -r backend/requirements.txt
```

---

## 4. Install Frontend Dependencies

```bash
npm install
```

---

## 5. Start Application

```bash
npm run dev
```

This starts:

* FastAPI backend
* Vite frontend

---

# 🌍 Open Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 📱 Mobile Testing

Run:

```bash
npm run dev -- --host
```

Then open on phone:

```text
http://YOUR_LOCAL_IP:5173
```

Example:

```text
http://192.168.1.10:5173
```

Phone and laptop must be connected to the same WiFi network.

---

# 📂 Project Structure

```text
janadhikar/
│
├── backend/
│   ├── agents/
│   ├── rag/
│   ├── main.py
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── App.jsx
│   └── App.css
│
├── package.json
└── vite.config.js
```

---

# 🔒 Design Philosophy

JanAdhikar was designed around:

* accessibility
* low digital literacy
* multilingual interaction
* conversational UX
* emotional trust
* mobile-first usability

The goal was not to build “another chatbot”.

The goal was to redesign welfare discovery into a familiar conversational experience.

---

# ⚠ Important Notes

This platform provides:

* informational assistance
* eligibility guidance
* legal-awareness support

It does NOT replace:

* official government verification
* legal professionals
* formal application approval

---

# 🔮 Future Improvements

Potential future directions:

* OCR document understanding
* WhatsApp integration
* district-level personalization
* multilingual expansion
* real-time scheme updates
* cloud deployment
* stronger recommendation intelligence

---

# 🏆 Hackathon Vision

JanAdhikar aims to make government welfare access:

* simpler
* conversational
* multilingual
* human-centered
* accessible to ordinary citizens

---

# 📜 License

This project is intended for educational and hackathon purposes.
