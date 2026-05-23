from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.agents.eligibility_agent import get_eligible_schemes
from backend.agents.legal_agent import get_legal_guidance
from backend.language.translator import normalize_language
from backend.rag.retriever import retrieve_relevant


app = FastAPI(title="JanAdhikar Offline API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EligibilityRequest(BaseModel):
    name: str = ""
    age: int = Field(ge=0)
    gender: str
    state: str
    occupation: str
    monthly_income: int = Field(ge=0)
    language: str = "en"


class LegalRequest(BaseModel):
    question: str
    language: str = "en"


@app.get("/")
def root():
    return {"status": "running", "app": "JanAdhikar Offline API", "version": "2.0"}


@app.post("/check-eligibility")
def check_eligibility(body: EligibilityRequest):
    payload = body.model_dump()
    language = normalize_language(payload.pop("language", "en"))
    results = get_eligible_schemes(payload, language)
    retrieval = retrieve_relevant(
        f"{payload.get('occupation', '')} {payload.get('state', '')} {payload.get('gender', '')} {payload.get('monthly_income', 0)}"
    )
    return {
        **results,
        "retrieval_context": retrieval,
    }


@app.post("/legal-advice")
def legal_advice(body: LegalRequest):
    language = normalize_language(body.language)
    legal_answer = get_legal_guidance(body.question, language)
    retrieval = retrieve_relevant(body.question)
    return {
        "answer": legal_answer["answer"],
        "topic": legal_answer["topic"],
        "law_reference": legal_answer["law_reference"],
        "confidence": legal_answer["confidence"],
        "retrieval_context": retrieval,
    }


@app.post("/api/recommend-schemes")
def recommend_schemes_compat(body: EligibilityRequest):
    return check_eligibility(body)


@app.post("/api/legal-chat")
def legal_chat_compat(body: LegalRequest):
    return legal_advice(body)
