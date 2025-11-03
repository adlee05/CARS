import { useState, useEffect } from "react";
import Blog02Page from "@/components/homepage/cardTest";
import BlogPage from "@/components/hero-section/page";
import { fetchNews, fetchNewsByRegion } from "@/services/api";
import type { Article } from "@/types/article";

export default function Homepage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsByRegion("IN");
        setArticles(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <BlogPage articles={articles} />
      <Blog02Page articles={articles} />
    </>
  );
}
