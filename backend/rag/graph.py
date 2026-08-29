"""KrishiAI RAG workflow using Ollama (local/free LLM)."""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# OLLAMA CONFIGURATION
# ============================================================

OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://localhost:11434"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "llama3.2"
)

# ============================================================
# LOCAL AGRICULTURAL KNOWLEDGE BASE
# ============================================================

DOCS = [
    (
        "crop",
        "Wheat generally prefers moderately fertile soil and a pH commonly "
        "around 6.0–7.5. Match variety, season and local climate."
    ),

    (
        "soil",
        "Nitrogen supports leafy growth; phosphorus supports roots and "
        "reproductive development; potassium supports water regulation "
        "and plant resilience."
    ),

    (
        "disease",
        "Early blight can cause brown lesions and yellowing on tomato leaves. "
        "Remove severely affected tissue, improve airflow and avoid prolonged "
        "leaf wetness."
    ),

    (
        "irrigation",
        "Irrigation decisions should consider crop stage, soil moisture, "
        "rainfall and temperature rather than a fixed schedule."
    ),

    (
        "safety",
        "For pesticides and fertilizers, follow the product label and local "
        "agricultural recommendations. Image results are possible diagnoses, "
        "not laboratory confirmation."
    ),
]


# ============================================================
# KNOWLEDGE RETRIEVAL
# ============================================================

def retrieve(q: str):
    """Simple local knowledge retrieval."""

    words = set(q.lower().split())
    ranked = []

    for topic, text in DOCS:
        score = sum(
            1
            for w in words
            if len(w) > 3 and w in text.lower()
        )

        ranked.append((score, text))

    results = [
        text
        for score, text in sorted(
            ranked,
            key=lambda x: x[0],
            reverse=True
        )[:3]
        if score > 0
    ]

    return results or [DOCS[-1][1]]


# ============================================================
# OLLAMA AI FUNCTION
# ============================================================

def call_ollama(messages):
    """Send messages to the local Ollama server."""

    url = f"{OLLAMA_BASE_URL}/api/chat"

    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.3
        }
    }

    try:
        response = requests.post(
            url,
            json=payload,
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        return data["message"]["content"]

    except requests.exceptions.ConnectionError:
        raise RuntimeError(
            "Cannot connect to Ollama. "
            "Make sure Ollama is running and try: ollama run llama3.2"
        )

    except requests.exceptions.Timeout:
        raise RuntimeError(
            "Ollama took too long to respond. "
            "Try again or use a smaller model."
        )

    except requests.exceptions.HTTPError as e:
        raise RuntimeError(
            f"Ollama returned an error: {e}"
        )

    except Exception as e:
        raise RuntimeError(
            f"Ollama error: {e}"
        )


# ============================================================
# ANSWER QUESTION
# ============================================================

def answer_question(
    q: str,
    language: str = "English",
    history=None
):
    """
    Generate an agricultural answer using
    Ollama + retrieved agricultural knowledge.
    """

    history = history or []

    # Retrieve relevant knowledge
    context = "\n".join(retrieve(q))

    # System instructions
    system_prompt = f"""
You are KrishiAI, an agricultural AI assistant.

Your job is to help farmers with:

- crops
- soil
- plant diseases
- fertilizers
- irrigation
- farming practices
- weather-related farming questions

Use the retrieved agricultural knowledge when relevant.

Retrieved agricultural knowledge:

{context}

Important instructions:

1. Give practical and easy-to-understand answers.
2. Do not claim certainty for plant disease diagnosis from symptoms alone.
3. For pesticides and fertilizers, recommend following the product label
   and local agricultural guidance.
4. If the user provides insufficient information, ask for the crop,
   location, symptoms or measurements.
5. Do not invent measurements, laboratory results or diagnoses.
6. Answer in {language}.
"""

    messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    # Add previous conversation
    for item in history[-10:]:
        if isinstance(item, dict):

            role = item.get("role")
            content = item.get("content")

            if role in ("user", "assistant") and content:

                messages.append(
                    {
                        "role": role,
                        "content": content
                    }
                )

    # Add current question
    messages.append(
        {
            "role": "user",
            "content": q
        }
    )

    # Ask Ollama
    return call_ollama(messages)


# ============================================================
# OPTIONAL LANGGRAPH SUPPORT
# ============================================================

try:

    from langgraph.graph import StateGraph, START, END

    LANGGRAPH_AVAILABLE = True

except Exception:

    LANGGRAPH_AVAILABLE = False


def build_graph():

    if not LANGGRAPH_AVAILABLE:
        return None

    from typing import TypedDict

    class State(TypedDict):
        question: str
        language: str
        history: list
        context: list
        answer: str

    def retrieve_node(state):

        return {
            **state,
            "context": retrieve(
                state["question"]
            )
        }

    def generate_node(state):

        return {
            **state,
            "answer": answer_question(
                state["question"],
                state["language"],
                state["history"]
            )
        }

    graph = StateGraph(State)

    graph.add_node(
        "retrieve",
        retrieve_node
    )

    graph.add_node(
        "generate",
        generate_node
    )

    graph.add_edge(
        START,
        "retrieve"
    )

    graph.add_edge(
        "retrieve",
        "generate"
    )

    graph.add_edge(
        "generate",
        END
    )

    return graph.compile()


GRAPH = build_graph()