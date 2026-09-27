import json
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.yfinance import YFinanceTools
from dotenv import load_dotenv

load_dotenv()


def get_recent_nvda_news() -> list[dict[str, str]]:
    query = urlencode({"q": "NVIDIA NVDA when:7d", "hl": "en-US", "gl": "US", "ceid": "US:en"})
    request = Request(
        f"https://news.google.com/rss/search?{query}",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    try:
        with urlopen(request, timeout=10) as response:
            root = ET.fromstring(response.read())
        news_items = [
            {
                "title": article.findtext("title"),
                "source": article.findtext("source") or "Unknown",
                "published": article.findtext("pubDate") or "Date unavailable",
                "url": article.findtext("link"),
            }
            for article in root.findall("./channel/item")[:5]
        ]
        return news_items
    except Exception as error:
        return [{"title": f"News search unavailable: {error}", "source": "Google News RSS", "published": "Unavailable", "url": ""}]


news_items = get_recent_nvda_news()
news_results = json.dumps(
    [
        {key: article[key] for key in ("title", "source", "published")}
        for article in news_items
    ],
    indent=2,
)

web_agent = Agent(
    name="Web Agent",
    role="Format the supplied recent NVDA news headlines",
    model=Groq(id="openai/gpt-oss-120b"),
    instructions=[
        "Use only the supplied titles, publishers, and publication dates.",
        "Report headlines in a table; do not summarize article contents or add interpretations.",
        "Do not claim to have opened articles or invent facts, quotes, or numbers.",
    ],
    show_tool_calls=True,
    markdown=True
)

finance_agent = Agent(
    name="Finance Agent",
    role="Get financial data",
    model=Groq(id="openai/gpt-oss-120b"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True)],
    instructions=["Use tables to display data"],
    show_tool_calls=True,
    markdown=True,
)

agent_team = Agent(
    model=Groq(id="openai/gpt-oss-120b"),
    team=[web_agent, finance_agent],
    instructions=[
        "Use tables to display data and identify sources.",
        "For news, report only the supplied headlines, publishers, and dates; do not infer article content or claim articles were opened.",
    ],
    show_tool_calls=True,
    markdown=True,
)

agent_team.print_response(
    "Summarize analyst recommendations and recent NVDA news from the past 7 days. "
    f"Use these Google News RSS results:\n{news_results}",
    stream=True,
)

print("\nNews sources:")
for article in news_items:
    if article["url"]:
        print(f"- {article['source']} ({article['published']}): {article['url']}")