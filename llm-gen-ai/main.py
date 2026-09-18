import streamlit as st
from langchain_helper import create_vector_db, get_qa_chain

st.markdown(
    """
    <style>
    div[data-testid="stTextInput"] > div {
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        background: transparent;
    }
    div[data-testid="stTextInput"] div[data-baseweb="input"],
    div[data-testid="stTextInput"] div[data-baseweb="input"]:focus-within,
    div[data-testid="stTextInput"] div:has(> input),
    div[data-testid="stTextInput"] input,
    div[data-testid="stTextInput"] input:focus,
    div[data-testid="stTextInput"] input:focus-visible {
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
    }
    div[data-testid="stTextInput"] *:focus,
    div[data-testid="stTextInput"] *:focus-visible {
        outline: none !important;
        box-shadow: none !important;
    }
    .stButton > button {
        border-radius: 10px;
        border: 1px solid #4f7cff;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("Codebasics Q&A 🌱")

btn = st.button("Create Knowledgebase")
if btn:
    create_vector_db()

question = st.text_input("Question: ", placeholder="Type your question here...")

if question:
    try:
        chain = get_qa_chain()
        response = chain.invoke(question)
        st.header("Answer")
        st.write(response)
    except Exception as e:
        st.error(f"Something went wrong while generating the answer: {e}")