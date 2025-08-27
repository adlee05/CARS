import feedparser
from datetime import datetime
import json
import os

rss_feeds = {
    "World": [
        "http://feeds.bbci.co.uk/news/world/rss.xml",
        "https://www.indiatoday.in/rss/1206577",
        "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms"
    ],
    "Business": [
        "http://feeds.bbci.co.uk/news/business/rss.xml",
        "https://www.indiatoday.in/rss/1206584",
        "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms"
    ],
    "Sports": [
        "http://feeds.bbci.co.uk/sport/rss.xml",
        "https://www.indiatoday.in/rss/1206614",
        "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms"
    ],
    "Top": [
        "https://www.indiatoday.in/rss/1206514",
        "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"
    ],
    "Entertainment": [
        "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
        "https://www.indiatoday.in/rss/1206583",
        "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms"
    ],
    "Political": [
        "http://feeds.bbci.co.uk/news/politics/rss.xml",
        "https://www.indiatoday.in/rss/1206590",
        "https://timesofindia.indiatimes.com/rssfeeds/7533058.cms"
    ],
    "More": [
        "http://feeds.bbci.co.uk/news/rss.xml",
        "https://www.indiatoday.in/rss/home",
        "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms"
    ]
}

def load_existing_news(file_path="category_news.json"):
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        return {cat: [] for cat in rss_feeds.keys()}

def scrape_news():
    categorized_texts = load_existing_news()

    for category, urls in rss_feeds.items():
        existing_links = {item['link'] for item in categorized_texts.get(category, [])}
        new_items = []

        for url in urls:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                if entry.get("link", "") in existing_links:
                    continue  # skip duplicates

                # Extract image if available
                image = ""
                if "media_content" in entry:
                    image = entry.media_content[0].get("url", "")
                elif "media_thumbnail" in entry:
                    image = entry.media_thumbnail[0].get("url", "")

                news_item = {
                    "title": entry.get("title", ""),
                    "link": entry.get("link", ""),
                    "published": entry.get("published", ""),
                    "summary": entry.get("summary", ""),
                    "image": image
                }

                new_items.append(news_item)

        # Insert new items at the beginning
        categorized_texts[category] = new_items + categorized_texts.get(category, [])

    with open("category_news.json", "w", encoding="utf-8") as f:
        json.dump(categorized_texts, f, indent=2, ensure_ascii=False)

    print(f"[INFO] category_news.json updated at {datetime.now()}")

if __name__ == "__main__":
    scrape_news()
