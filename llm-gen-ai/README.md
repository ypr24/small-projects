# LLM Gen AI FAQ Bot

This project is a small Retrieval-Augmented Generation (RAG) app built for FAQ-style question answering. It reads a CSV file, builds a FAISS vector store, retrieves relevant entries, and uses Google Gemini to generate a grounded response.

## What this project does

- loads a FAQ dataset from CSV
- converts the text into embeddings
- stores the vectors in a local FAISS index
- retrieves the most relevant documents for a query
- sends the retrieved context to Gemini for answer generation
- exposes the workflow through a Streamlit UI

## Project structure

.
├── .env
├── .venv/
├── README.md
├── codebasics_faqs.csv
├── faiss_index/
├── langchain_helper.py
├── main.py
├── qa-bot.ipynb
└── .gitignore

## Tech stack

- Python
- Streamlit
- LangChain
- LangChain Community
- LangChain Google GenAI
- Hugging Face Embeddings
- FAISS
- Google Gemini
- Python Dotenv

## Prerequisites

- Python 3.12 (this workspace uses Python 3.12)
- A valid Google Gemini API key
- Internet access for model and embedding downloads
- A local virtual environment

## Setup

From the project folder:

    cd /home/yash/Downloads/github/small-projects/llm-gen-ai
    python3 -m venv .venv
    source .venv/bin/activate

Install the dependencies:

    python -m pip install --upgrade pip
    python -m pip install streamlit python-dotenv langchain langchain-community langchain-google-genai faiss-cpu sentence-transformers pandas torchvision

## Environment variables

Create a .env file in the project root with your Google API key.

    GOOGLE_API_KEY=your_google_api_key_here
    GOOGLE_MODEL=gemini-3.6-flash

The app reads these variables in langchain_helper.py.

Note: the model is optional because a supported default is already configured, but setting it explicitly is recommended.

## Run the app

From the project root:

    source .venv/bin/activate
    streamlit run main.py

Then open the URL shown in the terminal, typically:

    http://localhost:8501

## How to use it

1. Click the Create Knowledgebase button the first time to build the local index.
2. Enter a question in the text box.
3. The app retrieves the best matching FAQ rows and asks Gemini to answer using only that context.

## How the code works

The application follows a Retrieval-Augmented Generation (RAG) workflow:

1. `main.py` creates the Streamlit interface. The **Create Knowledgebase** button calls `create_vector_db()`, and the question input calls `get_qa_chain()` when a question is entered.
2. `create_vector_db()` in `langchain_helper.py` reads the `prompt` column from `codebasics_faqs.csv` using `CSVLoader`.
3. Each FAQ document is converted into a numerical vector by the Hugging Face `all-MiniLM-L6-v2` embedding model.
4. The vectors are stored locally in the `faiss_index/` directory using FAISS. This index is created once and reused for future questions.
5. `get_qa_chain()` loads the FAISS index and retrieves the three FAQ documents most similar to the user's question.
6. The retrieved FAQ text is inserted into a prompt that instructs Gemini to answer only from the provided context. The `GOOGLE_MODEL` setting controls which Gemini model is used.
7. The generated answer is returned to `main.py` and displayed in the Streamlit page.

In short:

    CSV FAQs -> embeddings -> FAISS index -> similar FAQ retrieval -> Gemini answer -> Streamlit UI

The app uses LangChain Core runnables to connect retrieval, prompt formatting, Gemini, and text output. This avoids the deprecated `langchain.chains` import and keeps the code compatible with current LangChain versions.

## Important project notes

- The data file is codebasics_faqs.csv.
- The CSV expects a prompt column.
- The FAISS index is created in the faiss_index folder.
- The app requires a valid Google API key.
- Older model names such as gemini-2.0-flash may stop working as Google deprecates them.

## Troubleshooting

### Missing Google API key

If you see an error about GOOGLE_API_KEY, make sure your .env file exists and contains the variable.

### Model not found or deprecated

If Google returns a 404 for the model name, update the value in .env to a currently supported model, for example:

    GOOGLE_MODEL=gemini-3.6-flash

### Streamlit startup issues

Make sure you are using the project virtual environment instead of the system Python.

## Summary

This project is a working example of a simple FAQ Q&A system using LangChain, FAISS, and Gemini. It is useful for learning how retrieval-augmented generation works in a practical, low-complexity setup.
