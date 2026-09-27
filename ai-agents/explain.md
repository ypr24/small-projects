# Lesson Walkthrough

[Back to the README](README.md) for installation, API-key setup, and the lesson index. These seven scripts are independent examples: each makes its own request when run and prints its result in the terminal.

## Contents

- [Shared setup and output](#shared-setup-and-output)
- [Lesson 1: One model call](#lesson-1-one-model-call-lec1py)
- [Lesson 2: Finance tools](#lesson-2-finance-tools-lec2py)
- [Lesson 3: NVDA news and finance](#lesson-3-nvda-news-and-finance-lec3py)
- [Lesson 4: Sourced research report](#lesson-4-sourced-research-report-lec4py)
- [Lesson 5: PDF retrieval](#lesson-5-pdf-retrieval-lec5py)
- [Lesson 6: CSV analysis](#lesson-6-csv-analysis-lec6py)
- [Lesson 7: Author research](#lesson-7-author-research-lec7py)

## Shared Setup and Output

The scripts load environment variables from `.env`. All lessons use `GROQ_API_KEY`; lessons 4 and 7 also need a valid `EXA_API_KEY`. Keep keys in `.env`, which is ignored by Git. See the [README setup](README.md#setup) for installation and example key names.

Run an individual lesson from the repository directory:

```bash
.venv/bin/python lec1.py
```

Replace `lec1.py` with the lesson you want to run. `print_response()` sends the request to Groq and formats its answer in the terminal. When `stream=True`, the response appears as it is generated. `show_tool_calls=True` displays tool activity, such as a search or knowledge-base lookup; a tool-call message means the operation was attempted, not necessarily that it succeeded. Live search results, finance data, and model wording can change between runs.

## Reproducing Outputs and Updating This Guide

With the project virtual environment active and the working directory set to the repository root, run one lesson at a time:

```bash
python lec1.py
python lec2.py
python lec3.py
python lec4.py
python lec5.py
python lec6.py
python lec7.py
```

Each command prints that lesson's current output. Run the commands individually rather than as one batch: they make live API requests and can use rate-limited quotas. To refresh an example below, copy a short excerpt from a completed run and label it with the capture date. If a service rejects a request, document the error separately; do not present a model-generated fallback as fetched or verified data.

To ask Copilot Chat to update this walkthrough, use a prompt like:

> Inspect `lec1.py` through `lec7.py` and update `explain.md` to match their current behavior. For each lesson, explain the code-to-output flow and include a concise, dated excerpt only from output that was actually produced by running that script. Distinguish API failures and warnings from successful results, do not invent output, and finish by checking Markdown links and `git diff --check`.

## Lesson 1: One Model Call (`lec1.py`)

**How it works:** The script creates an `Agent` using Groq's `openai/gpt-oss-20b` model. It gives the agent no tools or external data and sends a prompt asking for a two-sentence horror story.

**What the output means:** The terminal displays a newly generated short story. Different runs can produce different stories because the response comes directly from the language model.

**Example live output (one run, 2026-09-28):**

> I heard my daughter's laughter echo through the empty house, but when I turned on the TV, the screen was blank except for the words “I’m watching you” in bright, trembling white. Just then, the front door creaked open on its own, and a cold, wet hand pressed against my chest as the laughter grew louder, no longer from a child but from the walls themselves.

## Lesson 2: Finance Tools (`lec2.py`)

**How it works:** The agent receives selected Yahoo Finance functions for stock prices, analyst recommendations, and fundamentals, plus the Python function `get_company_symbol()`. That local function maps example company names to tickers. In this demonstration, `Phidata` intentionally maps to `MSFT`.

**What the output means:** The agent resolves the company names, requests data for Tesla (`TSLA`) and Microsoft (`MSFT`), then presents a comparison in tables. `show_tool_calls=True` and `debug_mode=True` expose tool activity and additional diagnostics. The values are live finance data, not fixed expected output; Yahoo Finance availability and returned data can vary.

**Example live output (2026-09-28):**

```text
Fundamental Snapshot (latest data)
Metric             Tesla (TSLA)       Microsoft (MSFT)
P/E Ratio          171.3x             21.8x
EPS (TTM)          $1.08              $17.96
Dividend Yield     none               0.76%

Analyst Recommendations (most recent period)
				  Tesla              Microsoft
Strong Buy         4                  14
Buy                15                 39
Hold               20                 2
Sell / Strong Sell 4                  0
```

The run resolved `Phidata` to `MSFT`; the response labeled that column Microsoft. These figures are one Yahoo Finance snapshot, not guaranteed future values.

## Lesson 3: NVDA News and Finance (`lec3.py`)

**How it works:** Before creating the agent team, Python requests Google News RSS for NVIDIA stories from the last seven days and parses up to five headlines, publishers, dates, and URLs. The web agent receives only the headline metadata. Separately, the finance agent uses Yahoo Finance tools for NVDA data. A coordinating agent delegates the news and finance work, then combines the results.

**What the output means:** The team response reports analyst recommendations alongside news headlines and dates. After the response, Python prints each news source URL directly from the RSS records. The web agent is instructed not to invent article summaries because the RSS feed supplies headlines and metadata, not the full article text. If RSS access fails, the output reports that search was unavailable; it does not mean the finance request failed too.

**Example live output (2026-09-28):**

```text
Analyst Recommendations (NVDA)
Strong Buy: 10 | Buy: 48 | Hold: 2 | Sell: 1 | Strong Sell: 0

Recent NVDA headlines (past 7 days)
Yahoo Finance  | Bull of the Day: NVIDIA Corp. (NVDA)                 | 22 Sep 2026
Morningstar    | Nvidia's Immense Dividend Hike Puts Dividend Growth...| 23 Sep 2026
CNBC           | Nvidia options are doing something unusual...           | 22 Sep 2026
```

Python then prints the RSS URLs for all five headlines. The titles and ratings are a captured snapshot and will change on later runs.

## Lesson 4: Sourced Research Report (`lec4.py`)

**How it works:** Python runs three focused Exa keyword searches, requesting up to three results per search with excerpts. It validates that each response is readable and contains results before asking Groq to write. The model receives the collected results and is instructed to use only those sources and distinguish evidence from speculation.

**What the output means:** The report streams to the terminal and is saved to `tmp/simulation_theory_report.md`. It is generated from the Exa results, not an independently verified scientific review. Check cited sources before relying on factual claims. A missing, invalid, or unsuccessful Exa search stops the script before report generation instead of producing an unsourced report.

**Example live output (2026-09-28):**

```text
Simulated Realities: A Fact-Based Survey of the Simulation Hypothesis

1. Philosophical Foundations - Bostrom's Trilemma
The report describes the argument as conditional, rather than empirical proof.

Takeaway
No universally accepted physical experiment has confirmed or falsified the hypothesis.

References
PhilPapers; Wikipedia; Santa Fe Institute; other retrieved sources
```

That run performed all three Exa searches and generated a report in about 55 seconds. This is an excerpt, not a claim that every statement in a generated report has been independently fact-checked.

## Lesson 5: PDF Retrieval (`lec5.py`)

**How it works:** `PDFUrlKnowledgeBase` reads a public Thai recipes PDF. Phidata splits the extracted text into documents, the `all-MiniLM-L6-v2` sentence-transformer embeds them into 384-dimensional vectors, and LanceDB stores them in `tmp/lancedb`, in the `recipes_minilm` table. The agent is connected with `knowledge_base=knowledge_base`; when asked about chicken and galangal soup, it searches those stored chunks and uses the matches to answer.

**What the output means:** The answer gives the recipe details found in the PDF, such as the one-serving quantities, preparation steps, and cooking tips. `Added 0 documents` can be normal on later runs: the loader skips chunks already in the table, so it means zero *new* documents were added, not necessarily that the table is empty. The PDF may emit `fontTools` warnings because that optional package is absent; in the observed run, text extraction and retrieval still worked. The PDF and public embedding model need internet access on the first run.

**Example live output excerpt (2026-09-28):**

```text
Tom Kha Gai - Chicken & Galangal in Coconut Milk Soup
Chicken: 150 g | Young galangal: 50 g | Lemongrass: 100 g
Coconut milk: 250 g | Chicken stock: 100 g

Bring the stock and coconut milk to a slow boil; add galangal,
lemongrass, chicken, and mushrooms. Finish with lime juice off heat.
```

The quantities and method above came from the retrieved Thai recipe chunk. PDF font warnings preceded this output but did not prevent the text from being extracted.

## Lesson 6: CSV Analysis (`lec6.py`)

**How it works:** `DuckDbAgent` receives a semantic description of a `movies` table backed by a public IMDb CSV URL. The natural-language prompt asks for the row count, sum of ratings, and average rating. The agent translates the request into DuckDB operations against the CSV and returns the computed values.

**What the output means:** The terminal response contains those three aggregate results, formatted in Markdown. The documented sample dataset has 1,000 rows, a rating sum of 6723.2, and an average rating of 6.7232; live file changes or access problems can change the result. The lesson needs access to the CSV URL and a working Groq key.

**Live dataset result (2026-09-28):**

```text
Movie count: 1000
Sum of ratings: 6723.2
Average rating: 6.7232
```

These aggregates were confirmed directly against the CSV with DuckDB. In a separate `lec6.py` run on the same date, Groq rejected the request with a 429 tokens-per-day limit before the agent could return its formatted answer; retry after the quota resets to see the agent-generated response.

## Lesson 7: Author Research (`lec7.py`)

**How it works:** Python makes one Exa keyword search for Albert Camus, capped at five results with each text excerpt limited to 350 characters and highlights disabled. It checks for API errors or an empty response before calling Groq. The model receives only the bounded result excerpts and has no search tools of its own, which keeps the request smaller and prevents another model-controlled search loop.

**What the output means:** The terminal shows a concise report based on the provided excerpts, followed by source titles and their exact URLs printed by Python. If an excerpt does not include a specific work or award, the report should say that the excerpt did not provide it rather than guess. Exa errors stop the script before report generation. Bounding the excerpts also addresses the Groq request-size failure encountered when search results exceeded the model's token limit.

**Example live output excerpt (2026-09-28):**

```text
Albert Camus - Quick Overview
Born 7 November 1913 in Mondovi, French Algeria; died 4 January 1960.
Major award: Nobel Prize in Literature (1957).
Notable works: the supplied excerpts did not provide specific titles.

Sources: Britannica; Internet Encyclopedia of Philosophy; NobelPrize.org; others
```

The script printed the exact URLs for its five Exa results after the summary. This excerpt shows why a request can mention notable works while the model correctly reports that the returned short excerpts did not name any.
