import csv
import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")
if google_api_key is None:
    raise ValueError("GOOGLE_API_KEY not found in the environment variables.")

file_path = "codebasics_faqs.csv"
encoding = "Windows-1252"
source_column = "prompt"
vectordb_file_path = "faiss_index"
# Google has deprecated older Gemini model aliases.
# Keep this overrideable via .env, but default to the currently advertised model.
model_name = os.getenv("GOOGLE_MODEL", "gemini-3.6-flash")

llm = ChatGoogleGenerativeAI(
    model=model_name,
    google_api_key=google_api_key,
    temperature=0.2,
)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


def create_vector_db():
    loader = CSVLoader(file_path=file_path, source_column=source_column, encoding=encoding)
    data1 = []

    try:
        data1 = loader.load()
    except UnicodeDecodeError as e:
        print(f"Error loading CSV file: {e}")
        return
    except csv.Error as e:
        print(f"CSV error: {e}")
        return
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return

    if not data1:
        print("No data loaded from the CSV file.")
        return

    vectordb = FAISS.from_documents(documents=data1, embedding=embeddings)
    vectordb.save_local(vectordb_file_path)
    print(f"Vector database created at: {vectordb_file_path}")


def get_qa_chain():
    vectordb = FAISS.load_local(vectordb_file_path, embeddings, allow_dangerous_deserialization=True)
    retriever = vectordb.as_retriever(search_kwargs={"k": 3})

    prompt_template = """Given the following context and a question, generate an answer based on this context only.
    In the answer try to provide as much text as possible from the "response" section in the source document context without making much changes.
    If the answer is not found in the context, kindly state "I don't know." Don't try to make up an answer.

    CONTEXT: {context}

    QUESTION: {question}"""

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"],
    )

    def format_documents(documents):
        return "\n\n".join(document.page_content for document in documents)

    return (
        {
            "context": retriever | format_documents,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )


if __name__ == "__main__":
    create_vector_db()
    chain = get_qa_chain()
    print(chain.invoke("Do you have javascript course?"))


