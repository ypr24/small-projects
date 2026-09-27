# AI Agents Lecture Examples

Seven runnable Python examples demonstrate LLM agents built with Phidata and Groq, from a basic response through finance tools, web research, PDF retrieval, and data analysis.

**[Read the lesson walkthrough](explain.md)** for each lesson's data flow, how its code produces the terminal output, and what to make of common warnings and API errors.

## Setup

Requirements: Python 3.10 or newer, internet access, and the API keys needed for the lesson you plan to run.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt
```

Create a `.env` file in the project directory. Keep it private; `.env` is ignored by Git.

```dotenv
GROQ_API_KEY=your_groq_api_key
EXA_API_KEY=your_exa_api_key
```

`GROQ_API_KEY` is needed by all lessons. `EXA_API_KEY` is needed by `lec4.py` and `lec7.py`. Lessons 2 and 3 use Yahoo Finance; lesson 3 also reads Google News RSS. Lesson 5 downloads its public sentence-transformer model locally on first run, so it needs internet access but no Hugging Face API token.

## Run A Lesson

```bash
.venv/bin/python lec1.py
```

Replace `lec1.py` with `lec2.py` through `lec7.py` to run another example. These lessons call live APIs and public data sources, so responses, prices, news, and recommendations can change. Some lessons also write generated data under `tmp/`.

## Lessons

| Script | Example | Extra setup |
| --- | --- | --- |
| [lec1.py](lec1.py) | Generate a two-sentence horror story with one model call. | Groq |
| [lec2.py](lec2.py) | Compare Tesla finance data with the example mapping `Phidata -> MSFT`. | Groq, Yahoo Finance access |
| [lec3.py](lec3.py) | Combine NVDA analyst data with recent news headlines and source links. | Groq, Yahoo Finance access, Google News RSS |
| [lec4.py](lec4.py) | Search Exa three times and save a sourced simulation-theory report. | Groq, valid Exa API key |
| [lec5.py](lec5.py) | Retrieve a Thai recipe from a PDF indexed in LanceDB. | Groq, first-run PDF/model access |
| [lec6.py](lec6.py) | Ask natural-language questions about an IMDb CSV using DuckDB. | Groq, CSV access |
| [lec7.py](lec7.py) | Search Exa for Albert Camus sources and summarize bounded excerpts. | Groq, valid Exa API key |

The [lesson walkthrough](explain.md) includes a step-by-step account of how each script creates its output, plus source and troubleshooting notes.

## Output Notes

These lessons use live models, APIs, and public data, so wording, search results, and financial figures can change between runs. Tool-call messages show work performed; they are not themselves proof that a tool succeeded. Lessons 4 and 7 stop if Exa fails rather than asking the model to invent a sourced result. In lesson 5, `Added 0 documents` can mean the PDF chunks were already indexed and skipped as duplicates.

## Validate Syntax

```bash
.venv/bin/python -m py_compile lec1.py lec2.py lec3.py lec4.py lec5.py lec6.py lec7.py
```
