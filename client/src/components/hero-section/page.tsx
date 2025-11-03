import BlogPage from "@/components/hero-section/blog-page";
import { useState, useEffect } from "react";
import { fetchNews } from "@/services/api";
import type { Article } from "@/types/article";
import HeroShimmer from "@/components/hero-section/hero-shimmer";

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchNews();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load articles",
        );
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);
  if (loading) {
    return <HeroShimmer />;
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
    </>
  );
}
