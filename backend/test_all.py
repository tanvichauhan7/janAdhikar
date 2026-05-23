from backend.agents.eligibility_agent import get_eligible_schemes
from backend.agents.legal_agent import get_legal_guidance
from backend.rag.retriever import retrieve_relevant


def test_eligibility():
    result = get_eligible_schemes(
        {
            "name": "Rekha",
            "age": 28,
            "gender": "female",
            "state": "Bihar",
            "occupation": "student",
            "monthly_income": 9000,
        },
        "en",
    )
    assert result["total_count"] >= 1


def test_legal_guidance():
    result = get_legal_guidance("My husband beats me at home", "en")
    assert "Domestic Violence" in result["law_reference"] or "Domestic" in result["topic"]


def test_retrieval():
    result = retrieve_relevant("loan for small business", top_k=2)
    assert len(result) == 2
