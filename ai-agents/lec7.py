import json
from phi.model.groq import Groq
from phi.agent import Agent
from phi.tools.exa import ExaTools

from dotenv import load_dotenv
load_dotenv()

exa = ExaTools(type="keyword", num_results=5, text_length_limit=350, highlights=False)
search_response = exa.search_exa(
    query="Albert Camus biography notable works literary influences awards",
    num_results=5,
)
if search_response.startswith(("Error:", "Please set the EXA_API_KEY")):
    raise SystemExit(f"Exa search failed; no report was generated.\n{search_response}")

try:
    search_results = json.loads(search_response)
except json.JSONDecodeError as error:
    raise SystemExit("Exa returned an unreadable response; no report was generated.") from error

if not isinstance(search_results, list) or not search_results:
    raise SystemExit("Exa returned no results; no report was generated.")

source_details = [
    {key: result[key] for key in ("title", "author", "published_date", "text") if result.get(key)}
    for result in search_results
]

# Creating the Author Research Agent
author_research_agent = Agent(
    name="Author Researcher",
    model=Groq(id="openai/gpt-oss-120b"),
    show_tool_calls=True,
    markdown=True,
    description="You are an expert author research agent. Your role is to assist users in gathering detailed, customized information about authors, their works, awards, and literary influence.",
    instructions=[
        "Use only the supplied Exa result excerpts to summarize the author's biography, notable works, influences, and awards.",
        "Keep the response concise and factual; do not invent details, citations, or URLs.",
        "Cite sources by their exact supplied titles. The script prints the source URLs after your response.",
    ],
)

# Example query to gather author information
author_research_agent.print_response(
    "Find information about Albert Camus's biography, notable works, literary influences, and awards. "
    f"Use these Exa results:\n{json.dumps(source_details, ensure_ascii=False)}",
    stream=True,
)

print("\nSources:")
for result in search_results:
    title = result.get("title", "Untitled source")
    url = result.get("url")
    if url:
        print(f"- {title}: {url}")
