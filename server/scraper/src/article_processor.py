from utils import parse_date, setup_logging
import re  # for text cleaning

logger = setup_logging()

def clean_article_text(text):
    # Remove timestamps (e.g., "9 hours ago", "2 days ago")
    text = re.sub(r'\d+\s+(hour|minute|day|week|month|year)s?\s+ago', '', text)
    
    # Remove "Share" and "Save" buttons
    text = re.sub(r'\b(Share|Save|Tweet|Like)\b', '', text)
    
    # Remove standalone journalist titles
    text = re.sub(r'\b(Diplomatic correspondent|Reporter|Journalist|Editor)\b', '', text, flags=re.IGNORECASE)
    
    # Remove multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text)
    
    # Remove leading/trailing whitespace
    text = text.strip()
    
    return text

def process_article(entry, feed, region):
    """Processes a single RSS entry into a clean dictionary."""
    try:
        from newspaper import Article  # Import here to avoid global scope issues
        article = Article(entry.link)
        article.download()
        article.parse()

        # Clean text: Remove extra whitespace, ads, etc.
        clean_content = clean_article_text(article.text)  # Normalize spaces
        if len(clean_content) < 100:  # Basic validation
            raise ValueError("Article content too short—possibly failed extraction.")

        processed_data = {
            'title': article.title or entry.title,
            'content': clean_content,
            'url': entry.link,
            'published_date': parse_date(entry.published) if 'published' in entry else parse_date(feed.feed.published),
            'source': feed.feed.title,
            'region': region,  # Tag with region for later filtering
            'image': article.top_image
        }

        logger.info(f"Processed article: {processed_data['title']} from {region}")
        return processed_data
    except Exception as e:
        logger.error(f"Error processing article {entry.link}: {e}")
        return None  # Skip invalid articles
