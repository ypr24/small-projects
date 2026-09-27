from phi.agent import Agent
from phi.model.groq import Groq
from phi.embedder.sentence_transformer import SentenceTransformerEmbedder
from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.vectordb.lancedb import LanceDb, SearchType
from dotenv import load_dotenv

load_dotenv()


class CachedSentenceTransformerEmbedder(SentenceTransformerEmbedder):
    def get_embedding(self, text: str) -> list[float]:
        if self.sentence_transformer_client is None:
            from sentence_transformers import SentenceTransformer

            self.sentence_transformer_client = SentenceTransformer(self.model)
        return self.sentence_transformer_client.encode(text).tolist()

# Create a knowledge base from a PDF
knowledge_base = PDFUrlKnowledgeBase(
    urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
    # Use LanceDB as the vector database
    vector_db=LanceDb(
        table_name="recipes_minilm",
        uri="tmp/lancedb",
        search_type=SearchType.vector,
        embedder=CachedSentenceTransformerEmbedder(
            model="sentence-transformers/all-MiniLM-L6-v2",
            dimensions=384,
        ),
    ),
)
knowledge_base.load()

agent = Agent(
    model=Groq(id="openai/gpt-oss-20b"),
    # Add the knowledge base to the agent
    knowledge_base=knowledge_base,
    instructions=[
        "Answer using the retrieved recipe documents.",
        "Do not invent ingredients, quantities, or steps that are not supported by the documents.",
        "If the documents do not contain the requested recipe, say so clearly.",
    ],
    show_tool_calls=True,
    markdown=True,
)
agent.print_response("How do I make chicken and galangal in coconut milk soup", stream=True)
