import json
import os
from phi.model.groq import Groq
from textwrap import dedent
from dotenv import load_dotenv
from phi.agent import Agent
from phi.tools.exa import ExaTools

load_dotenv()

if not os.getenv("EXA_API_KEY"):
    raise SystemExit("EXA_API_KEY is missing. Add EXA_API_KEY=your_key to .env.")

exa = ExaTools(type="keyword", num_results=3, text_length_limit=1000, highlights=False)
searches = [
    "simulation hypothesis philosophical arguments Bostrom",
    "simulation hypothesis scientific tests and evidence physics",
    "simulation hypothesis recent scholarly research and critiques",
]
search_results = {}

for query in searches:
    result = exa.search_exa(query=query)
    if result.startswith(("Error:", "Please set the EXA_API_KEY")):
        raise SystemExit(f"Exa search failed; no report was generated. Check EXA_API_KEY and try again.\n{result}")
    try:
        records = json.loads(result)
    except json.JSONDecodeError as error:
        raise SystemExit("Exa returned an unreadable response; no report was generated.") from error
    if not isinstance(records, list) or not records:
        raise SystemExit(f"Exa returned no results for {query!r}; no report was generated.")
    search_results[query] = records

agent = Agent(
    model=Groq(id="openai/gpt-oss-120b"),
    description="You are an advanced AI researcher writing a report on a topic.",
    instructions=[
        "Use only the supplied Exa search results as sources.",
        "Do not invent facts, statistics, studies, citations, or URLs.",
        "If the supplied results do not support a claim, omit it or identify it as uncertain.",
        "Include references using the exact titles and URLs from the supplied results.",
        "Distinguish established evidence from philosophical speculation.",
    ],
    expected_output=dedent("""\
    An engaging, informative, and well-structured report in markdown format:

    ## Engaging Report Title

    ### Overview
    {give a brief introduction of the report and why the user should read this report}
    {make this section engaging and create a hook for the reader}

    ### Section 1
    {break the report into sections}
    {provide details/facts/processes in this section}

    ... more sections as necessary...

    ### Takeaways
    {provide key takeaways from the article}

    ### References
    - [Reference 1](link)
    - [Reference 2](link)
    - [Reference 3](link)

    - published on {date} in dd/mm/yyyy
    """),
    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
    save_response_to_file="tmp/simulation_theory_report.md",
)

agent.print_response(
    "Write a factual report on the simulation hypothesis using these results from "
    f"three Exa searches:\n{json.dumps(search_results, indent=2)}",
    stream=True,
)
