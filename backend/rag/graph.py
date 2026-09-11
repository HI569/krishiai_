"""
KrishiAI Universal Multilingual AI Engine.
Answers ALL questions: General knowledge, science, mathematics, daily questions,
conversations, and deep agricultural/farming expertise in 10 Indian languages.
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PREFERRED_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")

# Fallback candidate models in order of speed and availability
CANDIDATE_MODELS = [
    PREFERRED_MODEL,
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.7-flash"
]
# Remove duplicates preserving order
MODELS_TO_TRY = list(dict.fromkeys(CANDIDATE_MODELS))

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

# ============================================================
# AGRICULTURAL KNOWLEDGE FOR OFFLINE / DOMAIN FALLBACK
# ============================================================

AGRO_KNOWLEDGE = {
    "wheat_yield": {
        "English": """### 🌾 20% Yield Boost Plan for Wheat
1. **Critical Irrigation Stages**: Water at CRI (Crown Root Initiation, 21 days after sowing), Tillering (40-45 DAS), Jointing, and Flowering. Missing CRI irrigation reduces yield by up to 25%.
2. **Balanced Nutrition (NPK 120:60:40 kg/ha)**:
   - Basal dose: Full P & K + 1/3 Nitrogen at sowing.
   - Top dressing: 1/3 Nitrogen at 1st irrigation + 1/3 at 2nd irrigation.
   - Foliar Spray: Spray 2% Urea or 1% 19:19:19 during tillering and heading.
3. **Zinc & Micronutrients**: Apply 25 kg/ha Zinc Sulphate (21%) at basal or spray 0.5% ZnSO4 with 0.25% lime at boot stage.
4. **Weed & Rust Prevention**: Spray Sulfosulfuron 75% WG (33 g/ha) at 30-35 DAS for mixed weed control. Monitor for yellow rust.
> ⚠️ *Advisory*: Always verify soil moisture before applying top-dress nitrogen.""",

        "Hindi": """### 🌾 गेहूं की पैदावार 20% बढ़ाने की कार्ययोजना
1. **क्रांतिक सिंचाई चरण**: पहली सिंचाई बुवाई के 21 दिन बाद (CRI अवस्था) जरूर करें। इसके बाद कल्ले फूटते समय और फूल आने पर पानी दें।
2. **संतुलित खाद (NPK 120:60:40 किग्रा/हे.)**:
   - बुवाई के समय: पूरा फास्फोरस व पोटाश + एक तिहाई यूरिया।
   - पहली सिंचाई पर: एक तिहाई यूरिया।
   - दूसरी सिंचाई पर: बचा हुआ एक तिहाई यूरिया।
   - बालियां निकलते समय: 1% 19:19:19 का फोलियर स्प्रे करें।
3. **जिंक का प्रयोग**: बुवाई के समय 25 किग्रा जिंक सल्फेट दें या बालियों के समय 0.5% जिंक का छिड़काव करें।
4. **खरपतवार व पीला रतुआ नियंत्रण**: 30-35 दिन पर उचित खरपतवारनाशी का उपयोग करें।
> ⚠️ *सलाह*: यूरिया डालने से पहले खेत में पर्याप्त नमी होना आवश्यक है।"""
    },

    "yellow_leaves": {
        "English": """### 🍃 Diagnosis: Leaf Yellowing (Chlorosis)
1. **Nitrogen Deficiency**: Older bottom leaves turn pale yellow. Apply Urea @ 25-30 kg/acre or 1.5% foliar spray.
2. **Iron / Zinc Deficiency**: Upper young leaves turn yellow between veins. Spray Chelated Iron (1 g/L) or Zinc Sulphate (3 g/L).
3. **Overwatering / Root Rot**: Yellow leaves with wilting. Drain standing water immediately and apply Trichoderma.""",

        "Hindi": """### 🍃 पत्तियों का पीला पड़ना एवं उपाय
1. **नाइट्रोजन की कमी**: निचली पुरानी पत्तियां पीली पड़ती हैं। यूरिया 25-30 किग्रा/एकड़ दें या 1.5% यूरिया का छिड़काव करें।
2. **जिंक/आयरन की कमी**: नई ऊपरी पत्तियां पीली होती हैं। चिलेटेड जिंक (1 ग्राम/लीटर) का छिड़काव करें।
3. **जलभराव**: अतिरिक्त पानी तुरंत निकालें और मिट्टी में हवा का संचार होने दें।"""
    },

    "fertilizer_wheat": {
        "English": """### 🌾 Fertilizer Schedule for Wheat
- **At Sowing (Basal)**: DAP 55 kg/acre + MOP (Potash) 20 kg/acre + Urea 25 kg/acre + Zinc Sulphate 10 kg/acre.
- **1st Irrigation (21-25 days)**: Urea 35 kg/acre.
- **2nd Irrigation (40-45 days)**: Urea 30 kg/acre.
- **Heading Stage**: Spray 13:00:45 (Potassium Nitrate) @ 10 g/L for bold, heavy grains.""",

        "Hindi": """### 🌾 गेहूं के लिए संपूर्ण खाद सारणी
- **बुवाई के समय**: डीएपी 55 किग्रा + पोटाश 20 किग्रा + यूरिया 25 किग्रा + जिंक सल्फेट 10 किग्रा प्रति एकड़।
- **पहली सिंचाई पर (21 दिन)**: यूरिया 35 किग्रा/एकड़।
- **दूसरी सिंचाई पर (45 दिन)**: यूरिया 30 किग्रा/एकड़।
- **बालियां निकलने पर**: 13:0:45 (पोटैशियम नाइट्रेट) का 1% घोल छिड़कें।"""
    },

    "pest_control": {
        "English": """### 🐛 Integrated Pest Management (IPM)
1. **Sucking Pests (Aphids, Whiteflies, Thrips)**: Install yellow sticky traps (15/acre). Spray Neem oil (3 mL/L) or Imidacloprid 17.8% SL (0.5 mL/L).
2. **Caterpillars & Borers**: Use pheromone traps (5/acre). Spray Chlorantraniliprole 18.5% SC (0.4 mL/L) or Emamectin Benzoate 5% SG (0.5 g/L).""",

        "Hindi": """### 🐛 कीट नियंत्रण उपाय
1. **रस चूसक कीट (माहू, सफेद मक्खी)**: पीले स्टिकी ट्रैप लगाएं। नीम तेल (3 मिली/लीटर) या इमिडाक्लोप्रिड 17.8% SL (0.5 मिली/लीटर) का छिड़काव करें।
2. **इल्ली व तना छेदक**: फेरोमोन ट्रैप लगाएं। कोराजन (0.4 मिली/लीटर) का छिड़काव करें।"""
    }
}


def call_gemini(q: str, language: str = "English", history: list = None) -> str | None:
    """
    Calls Gemini API with dynamic model fallback to answer ANY question
    (General knowledge, daily life, mathematics, science, technology, agriculture).
    """
    if not GEMINI_API_KEY:
        return None

    system_instruction = (
        f"You are KrishiAI, an intelligent, helpful, and versatile AI assistant. "
        f"You MUST answer ALL questions asked by the user, including general questions, "
        f"daily queries, science, technology, mathematics, history, language, and culture, "
        f"as well as specialized agriculture, crop health, weather, and farming questions. "
        f"Always provide an accurate, helpful, well-formatted response. "
        f"Reply strictly in the user's selected language: {language}. "
        f"Keep the answer clear, polite, and concise."
    )

    contents = []
    if history:
        for item in history[-6:]:
            if isinstance(item, dict) and item.get("content"):
                role = "user" if item.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": item.get("content")}]})

    contents.append({"role": "user", "parts": [{"text": q}]})

    payload = {
        "system_instruction": {"parts": [{"text": system_instruction}]},
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 600
        }
    }

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }

    for model in MODELS_TO_TRY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            resp = requests.post(url, headers=headers, json=payload, timeout=6.0)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        ans = parts[0]["text"].strip()
                        if ans:
                            return ans
        except Exception:
            continue

    return None


def is_farming_related(query: str) -> bool:
    """Detects if query is related to farming/agriculture."""
    q = query.lower()
    agro_keywords = [
        "crop", "wheat", "rice", "paddy", "tomato", "cotton", "maize", "potato",
        "fertilizer", "urea", "dap", "npk", "potash", "irrigation", "soil",
        "farming", "agriculture", "seed", "pesticide", "insect", "pest", "disease",
        "blight", "yield", "mandi", "weather", "harvest", "sowing",
        "खेती", "फसल", "गेहूं", "धान", "खाद", "यूरिया", "सिंचाई", "मिट्टी", "कीट", "रोग", "पैदावार"
    ]
    return any(k in q for k in agro_keywords)


def offline_fallback(q: str, language: str = "English") -> str:
    """Provides an intelligent offline response based on question topic."""
    query_lower = q.lower()
    lang = language.capitalize() if language else "English"

    # If it is a farming question, use agronomic knowledge
    if is_farming_related(q):
        if any(w in query_lower for w in ["yield", "increase", "maximize", "boost", "पैदावार"]):
            data = AGRO_KNOWLEDGE["wheat_yield"]
            return data.get(lang) or data.get("Hindi" if lang in ["Marathi", "Gujarati"] else "English")

        if any(w in query_lower for w in ["yellow", "chlorosis", "पीली", "drying"]):
            data = AGRO_KNOWLEDGE["yellow_leaves"]
            return data.get(lang) or data.get("Hindi" if lang in ["Marathi", "Gujarati"] else "English")

        if any(w in query_lower for w in ["fertilizer", "dap", "urea", "npk", "खाद"]):
            data = AGRO_KNOWLEDGE["fertilizer_wheat"]
            return data.get(lang) or data.get("Hindi" if lang in ["Marathi", "Gujarati"] else "English")

        if any(w in query_lower for w in ["pest", "insect", "aphid", "worm", "कीड़ा"]):
            data = AGRO_KNOWLEDGE["pest_control"]
            return data.get(lang) or data.get("Hindi" if lang in ["Marathi", "Gujarati"] else "English")

        return (
            f"🌱 **KrishiAI Agricultural Advisory ({language})**:\n"
            f"For optimal crop management with '{q}', ensure balanced NPK fertilization, "
            f"maintain proper moisture according to crop growth stage, and regularly inspect for pests."
        )

    # If it is a greeting or general question offline
    if any(w in query_lower for w in ["hello", "hi", "hey", "नमस्ते", "नमस्कार", "who are you"]):
        if lang == "Hindi":
            return "नमस्ते! मैं KrishiAI हूँ, आपका बहुभाषी AI सहायक। आप मुझसे सामान्य ज्ञान, मौसम, विज्ञान, या खेती-किसानी से जुड़ा कोई भी प्रश्न पूछ सकते हैं।"
        return "Hello! I am KrishiAI, your intelligent AI assistant. I can answer any question about general knowledge, daily life, science, technology, as well as farming and agriculture. How can I help you today?"

    # Generic polite response when offline
    if lang == "Hindi":
        return f"नमस्ते! मुझे आपका प्रश्न मिला: '{q}'। मैं सभी प्रकार के सवालों का जवाब देने में सक्षम हूँ। कृपया सुनिश्चित करें कि इंटरनेट चालू है ताकि मैं तुरंत उत्तर दे सकूँ।"
    return f"Hello! I received your question: '{q}'. I can answer all general knowledge, science, and agricultural questions. Please verify your internet connection so I can provide real-time responses."


def answer_question(q: str, language: str = "English", history: list = None) -> str:
    """
    Main entry point for KrishiAI chat assistant.
    Answers EVERY question (general knowledge, calculations, daily life, agriculture).
    """
    history = history or []

    # 1. Primary: Gemini Multilingual Intelligence (Answers ALL questions)
    reply = call_gemini(q, language, history)
    if reply:
        return reply

    # 2. Offline fallback if internet is temporarily unreachable
    return offline_fallback(q, language)
