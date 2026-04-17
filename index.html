# app.py
"""
AI JobFit Chatbot 🔎🧠
Professional Streamlit App

Features:
- Enter a Job Description (required)
- Optional: upload a resume PDF
- Extracts key skills using KeyBERT
- Generates natural MCQs (no skill hint)
- Generates interview-style questions (T5-small)
- Calculates Job Fit Score using Sentence-BERT
"""

import streamlit as st
import tempfile
import pdfplumber
import random
import os
import json
from datetime import datetime

# History persistence file
HISTORY_FILE = "history.json"

def load_history():
    """Load history from file"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_history(history):
    """Save history to file"""
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(history, f, indent=4)
    except Exception:
        pass

# NLP / models
import spacy
from keybert import KeyBERT
import nltk
from nltk.corpus import wordnet as wn
from sentence_transformers import SentenceTransformer, util
from transformers import T5ForConditionalGeneration, T5Tokenizer

# Download NLTK data
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

# Streamlit setup
st.set_page_config(page_title="AI JobFit Chatbot", layout="wide", page_icon="🤖")

# Enhanced CSS for modern, attractive UI
st.markdown("""
<style>
    /* Global Styles */
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    /* Header Section */
    .header-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .title-text {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(45deg, #ffffff, #667eea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-align: center;
        margin-bottom: 1rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .subtitle-text {
        font-size: 1.2rem;
        color: black;
        text-align: center;
        font-weight: 300;
    }

    /* Card Styles */
    .card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        color: #333;
    }

    .input-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        padding: 2rem;
        margin: 1rem 0;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    /* Button Styles */
    .stButton>button {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stButton>button:hover {
        background: linear-gradient(45deg, #5a6fd8, #6a4190);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .stButton>button:active {
        transform: translateY(0px);
    }

    /* Form Elements */
    .stTextArea>textarea {
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        font-size: 1rem;
        padding: 1rem;
        transition: all 0.3s ease;
    }

    .stTextArea>textarea:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    .stFileUploader {
        border-radius: 12px;
        border: 2px dashed rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        transition: all 0.3s ease;
    }

    .stFileUploader:hover {
        border-color: rgba(255, 255, 255, 0.8);
        background: rgba(255, 255, 255, 0.2);
    }

    /* Radio Buttons */
    .stRadio>label {
        color: white;
        font-weight: 500;
        font-size: 1.1rem;
    }

    /* Sidebar */
    .sidebar .sidebar-content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 1rem;
        margin: 1rem 0;
    }

    /* Success Messages */
    .stSuccess {
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        border-radius: 12px;
        border: none;
        padding: 1rem;
        font-weight: 600;
    }

    /* Error Messages */
    .stError {
        background: linear-gradient(45deg, #f44336, #d32f2f);
        color: white;
        border-radius: 12px;
        border: none;
        padding: 1rem;
    }

    /* Warning Messages */
    .stWarning {
        background: linear-gradient(45deg, #ff9800, #f57c00);
        color: white;
        border-radius: 12px;
        border: none;
        padding: 1rem;
    }

    /* Expander */
    .streamlit-expanderHeader {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        font-weight: 600;
    }

    /* Progress Bars */
    .stProgress .st-bo {
        background: linear-gradient(45deg, #667eea, #764ba2);
    }

    /* Footer */
    .footer {
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        margin-top: 2rem;
        padding: 1rem;
    }

    /* Skills Display */
    .skill-tag {
        display: inline-block;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        margin: 0.25rem;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    /* MCQ Options */
    .mcq-option {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        margin: 0.25rem 0;
        border: 1px solid rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    }

    .mcq-option:hover {
        background: rgba(102, 126, 234, 0.1);
        border-color: #667eea;
    }

    /* History Items */
    .history-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .history-item:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }

    .history-date {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
    }

    .history-preview {
        font-size: 0.9rem;
        color: white;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# Header Section
st.markdown("""
<div class="header-container">
    <h1 class="title-text">🤖 AI JobFit Chatbot</h1>
    <p class="subtitle-text">💼 Generate personalized MCQs and interview questions from a Job Description or your Resume to assess Job Fit!</p>
</div>
""", unsafe_allow_html=True)

# Initialize session state
if 'mcqs' not in st.session_state:
    st.session_state.mcqs = []
if 'user_answers' not in st.session_state:
    st.session_state.user_answers = []
if 'generated' not in st.session_state:
    st.session_state.generated = False
if 'target_skills' not in st.session_state:
    st.session_state.target_skills = []
if 'history' not in st.session_state:
    st.session_state.history = load_history()
if 'current_job_description' not in st.session_state:
    st.session_state.current_job_description = ""

# ----- Load models -----
@st.cache_resource(show_spinner=False)
def load_spacy_model():
    return spacy.load("en_core_web_sm")

@st.cache_resource(show_spinner=False)
def load_keybert():
    return KeyBERT()

@st.cache_resource(show_spinner=False)
def load_sentence_transformer():
    return SentenceTransformer('all-MiniLM-L6-v2')

@st.cache_resource(show_spinner=False)
def load_t5():
    tokenizer = T5Tokenizer.from_pretrained("t5-small")
    model = T5ForConditionalGeneration.from_pretrained("t5-small")
    return tokenizer, model

with st.spinner("Loading models..."):
    nlp = load_spacy_model()
    kw_model = load_keybert()
    embed_model = load_sentence_transformer()
    t5_tokenizer, t5_model = load_t5()

# ----- Utility functions -----
def preprocess_text(text: str) -> str:
    return text.strip() if text else ""

def extract_skills_from_text(text: str, top_n: int = 10):
    text = preprocess_text(text)
    if not text:
        return []
    try:
        # Extract more keywords initially for filtering
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=top_n*5)
        keyword_texts = [k[0] for k in keywords]

        # Filter keywords based on exact match or high similarity to TECH_VOCAB
        filtered_skills = []
        for kw in keyword_texts:
            kw_lower = kw.lower()
            # Exact match first
            if any(tech.lower() == kw_lower for tech in TECH_VOCAB):
                filtered_skills.append(kw)
                continue
            # High similarity match
            kw_emb = embed_model.encode(kw, convert_to_tensor=True)
            vocab_embs = embed_model.encode(TECH_VOCAB, convert_to_tensor=True)
            scores = util.pytorch_cos_sim(kw_emb, vocab_embs)[0]
            max_score = float(scores.max())
            if max_score > 0.8:  # Even higher threshold for relevance
                filtered_skills.append(kw)

        # Remove duplicates and limit to top_n
        filtered_skills = list(dict.fromkeys(filtered_skills))[:top_n]

        if filtered_skills:
            return filtered_skills
        else:
            # Fallback: use spaCy noun chunks and filter similarly
            doc = nlp(text)
            chunks = [chunk.text.lower() for chunk in doc.noun_chunks if len(chunk.text) > 2]
            fallback_skills = []
            for chunk in chunks:
                chunk_lower = chunk.lower()
                # Exact match first
                if any(tech.lower() == chunk_lower for tech in TECH_VOCAB):
                    fallback_skills.append(chunk.title())
                    continue
                # High similarity match
                chunk_emb = embed_model.encode(chunk, convert_to_tensor=True)
                vocab_embs = embed_model.encode(TECH_VOCAB, convert_to_tensor=True)
                scores = util.pytorch_cos_sim(chunk_emb, vocab_embs)[0]
                max_score = float(scores.max())
                if max_score > 0.8:
                    fallback_skills.append(chunk.title())  # Title case for consistency
            return list(dict.fromkeys(fallback_skills))[:top_n]
    except Exception:
        # Final fallback
        doc = nlp(text)
        chunks = [chunk.text for chunk in doc.noun_chunks if len(chunk.text) > 2]
        return list(dict.fromkeys(chunks))[:top_n]

def extract_text_from_pdf_file(uploaded_file):
    if uploaded_file is None:
        return ""
    try:
        text = ""
        with pdfplumber.open(uploaded_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "
        return text
    except Exception:
        st.error("Failed to read PDF. Please upload a valid resume file.")
        return ""

# Comprehensive professional skills vocabulary (for distractors and skill filtering)
TECH_VOCAB = [
    # Programming & Development
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "R", "Ruby", "PHP", "Go", "Rust", "Swift", "Kotlin",
    "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Spring", "Laravel",

    # Data & Analytics
    "SQL", "NoSQL", "MongoDB", "MySQL", "PostgreSQL", "Oracle", "SQLite", "Redis", "Cassandra", "Firebase", "DynamoDB",
    "Machine Learning", "Deep Learning", "Data Science", "Data Analysis", "Statistics", "Data Visualization",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "Jupyter",
    "Tableau", "Power BI", "Excel", "ETL", "Spark", "Hadoop", "Kafka", "Airflow", "Flink",

    # Cloud & DevOps
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "Travis CI", "Terraform",
    "Git", "GitHub", "Linux", "Windows", "macOS", "CI/CD", "Agile", "Scrum", "Kanban",

    # APIs & Integration
    "REST API", "GraphQL", "SOAP", "JSON", "XML", "Microservices", "API Gateway",

    # Marketing & Sales
    "Digital Marketing", "SEO", "SEM", "Social Media Marketing", "Content Marketing", "Email Marketing",
    "Google Analytics", "Facebook Ads", "LinkedIn Ads", "CRM", "Salesforce", "HubSpot", "Marketing Automation",
    "Brand Management", "Market Research", "Customer Segmentation", "Conversion Rate Optimization",

    # Finance & Accounting
    "Financial Analysis", "Budgeting", "Forecasting", "Financial Modeling", "Risk Management", "Auditing",
    "QuickBooks", "SAP", "Oracle Financials", "Investment Banking", "Portfolio Management", "Tax Planning",
    "Financial Reporting", "Cost Accounting", "Mergers & Acquisitions", "Valuation", "Due Diligence",

    # Healthcare & Medical
    "Electronic Health Records", "HIPAA", "Patient Care", "Medical Coding", "Clinical Research", "Pharmacy",
    "Medical Devices", "Healthcare Administration", "Nursing", "Medical Imaging", "Telemedicine", "EMR",
    "Medical Billing", "Healthcare Compliance", "Patient Safety", "Quality Assurance",

    # Psychology & Mental Health
    "Clinical Psychology", "CBT", "Cognitive Behavioral Therapy", "Behavioral Analysis", "Psychological Assessment",
    "Diagnosis", "Therapy", "Counseling", "Mental Health", "Psychotherapy", "Group Therapy", "Individual Therapy",
    "Family Therapy", "Trauma Therapy", "Anxiety Disorders", "Depression", "PTSD", "Eating Disorders", "Addiction",
    "Substance Abuse", "Crisis Intervention", "Suicidal Ideation", "Risk Assessment", "Treatment Planning",
    "Progress Notes", "Patient Record Management", "Ethical Patient Handling", "Confidentiality", "Informed Consent",
    "Report Writing", "Psychological Testing", "Intelligence Testing", "Personality Assessment", "Neuropsychological Testing",
    "DSM-5", "ICD-10", "Evidence-Based Practice", "Motivational Interviewing", "Solution-Focused Therapy",
    "Psychodynamic Therapy", "Humanistic Therapy", "Existential Therapy", "Mindfulness", "Stress Management",
    "Coping Skills", "Emotional Regulation", "Interpersonal Skills", "Communication Skills", "Empathy", "Active Listening",
    "Cultural Competence", "Diversity Awareness", "Ethics in Psychology", "Professional Development", "Continuing Education",

    # Education & Training
    "Curriculum Development", "Educational Technology", "Learning Management Systems", "Classroom Management",
    "Student Assessment", "Instructional Design", "E-Learning", "Teacher Training", "Educational Psychology",
    "Special Education", "Language Teaching", "Online Education", "Educational Research",

    # Human Resources
    "Talent Acquisition", "Employee Relations", "Performance Management", "HRIS", "Workday", "ADP",
    "Compensation & Benefits", "Employee Engagement", "Diversity & Inclusion", "Labor Law", "Recruitment",
    "Onboarding", "Training & Development", "Succession Planning",

    # Project Management
    "Project Planning", "Risk Management", "Stakeholder Management", "Resource Allocation", "Gantt Charts",
    "Microsoft Project", "Jira", "Asana", "Trello", "PRINCE2", "PMP", "Change Management", "Quality Control",

    # Design & Creative
    "Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "Figma", "Sketch", "UI/UX Design",
    "Graphic Design", "Brand Identity", "Visual Communication", "Typography", "Color Theory", "User Research",

    # Legal & Compliance
    "Contract Law", "Intellectual Property", "Corporate Law", "Compliance", "Regulatory Affairs",
    "Legal Research", "Case Management", "Document Review", "Litigation Support", "Risk Assessment",

    # Operations & Supply Chain
    "Supply Chain Management", "Logistics", "Inventory Management", "Procurement", "Vendor Management",
    "Operations Research", "Lean Manufacturing", "Six Sigma", "Quality Management", "ERP Systems",

    # Customer Service & Support
    "Customer Relationship Management", "Help Desk", "Technical Support", "Client Management",
    "Service Level Agreements", "Zendesk", "Freshdesk", "Customer Satisfaction", "Complaint Resolution",

    # Research & Development
    "Research Methodology", "Experimental Design", "Data Collection", "Scientific Writing", "Grant Writing",
    "Peer Review", "Innovation Management", "Product Development", "R&D Strategy",

    # Soft Skills & Methodologies
    "Leadership", "Communication", "Team Management", "Problem Solving", "Critical Thinking", "Time Management",
    "Conflict Resolution", "Negotiation", "Presentation Skills", "Strategic Planning", "Business Analysis"
]

def get_wordnet_distractors(word, top_n=2):
    distractors = set()
    try:
        for syn in wn.synsets(word):
            for lemma in syn.lemmas():
                name = lemma.name().replace("_", " ")
                if name.lower() != word.lower():
                    distractors.add(name)
    except Exception:
        pass
    return list(distractors)[:top_n]

def get_embedding_distractors(skill, top_n=3, low=0.25, high=0.85):
    try:
        skill_emb = embed_model.encode(skill, convert_to_tensor=True)
        vocab_embs = embed_model.encode(TECH_VOCAB, convert_to_tensor=True)
        scores = util.pytorch_cos_sim(skill_emb, vocab_embs)[0]
        candidates = []
        for i, s in enumerate(scores):
            val = float(s)
            if low < val < high:
                candidates.append((TECH_VOCAB[i], val))
        candidates.sort(key=lambda x: -x[1])
        return [c[0] for c in candidates[:top_n]]
    except Exception:
        return []

# --- Natural MCQ Generator (No skill hint) ---
def generate_mcq_dynamic(skill, difficulty="medium"):
    question_patterns = [
        "Which of the following is most commonly used in this field?",
        "Which concept best fits the described technical area?",
        "Which skill is most relevant for solving such problems?",
        "Identify the most appropriate tool or method for this scenario.",
        "Which of the following techniques is essential for this domain?",
        "Choose the key concept typically applied in this area.",
        "What is an important aspect to understand when working in this domain?",
        "Select the core competency relevant to professionals in this role."
    ]
    question_text = random.choice(question_patterns)
    correct = skill
    wn_dist = get_wordnet_distractors(skill, top_n=1)
    emb_dist = get_embedding_distractors(skill, top_n=3)
    distractors = wn_dist + emb_dist

    if difficulty == "easy":
        distractors = distractors[:2]
    elif difficulty == "medium":
        distractors = distractors[:3]
    elif difficulty == "hard":
        distractors = distractors[:4]

    options = list(dict.fromkeys([correct] + distractors))
    if len(options) < 4:
        extras = [t for t in TECH_VOCAB if t.lower() != correct.lower() and t not in options]
        random.shuffle(extras)
        while len(options) < 4 and extras:
            options.append(extras.pop())

    random.shuffle(options)
    return {"question": question_text, "options": options, "answer": correct}

def generate_question_with_t5(skill_text, max_length=64):
    prompt = f"generate question: {skill_text}"
    inputs = t5_tokenizer.encode(prompt, return_tensors="pt", truncation=True)
    outputs = t5_model.generate(inputs, max_length=max_length, num_beams=4, early_stopping=True)
    return t5_tokenizer.decode(outputs[0], skip_special_tokens=True)

def calculate_fit_score(user_answers, mcqs):
    if not mcqs:
        return 0.0
    scores = []
    for ua, mcq in zip(user_answers, mcqs):
        expected = mcq["answer"]
        if not ua:
            scores.append(0.0)
            continue
        try:
            emb_ua = embed_model.encode(ua, convert_to_tensor=True)
            emb_exp = embed_model.encode(expected, convert_to_tensor=True)
            sim = util.pytorch_cos_sim(emb_ua, emb_exp).item()
            scores.append(max(0.0, float(sim)))
        except Exception:
            scores.append(0.0)
    return round(sum(scores) / len(scores) * 100, 2)

def calculate_skill_match(resume_skills, job_skills):
    rs, js = set(map(str.lower, resume_skills)), set(map(str.lower, job_skills))
    matched = rs.intersection(js)
    if not js:
        return 0.0, []
    percent = round(len(matched) / len(js) * 100, 2)
    return percent, list(matched)

def add_to_history(job_description):
    """Add current job description to history"""
    if job_description.strip():
        history_item = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "preview": job_description[:100] + "..." if len(job_description) > 100 else job_description,
            "full_text": job_description
        }
        # Add to beginning of history (newest first)
        st.session_state.history.insert(0, history_item)
        # Keep only last 10 items
        if len(st.session_state.history) > 10:
            st.session_state.history = st.session_state.history[:10]
        # Save to file
        save_history(st.session_state.history)

def load_from_history(index):
    """Load a job description from history"""
    if 0 <= index < len(st.session_state.history):
        st.session_state.current_job_description = st.session_state.history[index]["full_text"]

# --- Sidebar ---
st.sidebar.header("⚙️ Options")
difficulty = st.sidebar.selectbox("MCQ Difficulty:", ("easy", "medium", "hard"))
top_k_skills = st.sidebar.slider("Max skills to extract:", 3, 20, 8)
use_resume = st.sidebar.checkbox("Prioritize matched skills (when resume uploaded)", value=True)

st.sidebar.markdown("---")
st.sidebar.markdown("### 📜 History")
st.sidebar.markdown("Recent job descriptions:")

# Display history in sidebar
if st.session_state.history:
    for i, item in enumerate(st.session_state.history):
        if st.sidebar.button(
            f"**{item['timestamp']}**\n{item['preview']}", 
            key=f"hist_{i}",
            use_container_width=True
        ):
            load_from_history(i)
            st.rerun()
else:
    st.sidebar.info("No history yet. Generate questions to see history here.")
