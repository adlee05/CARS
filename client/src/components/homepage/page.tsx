import { useState, useEffect } from "react";
import Blog02Page from "@/components/homepage/cardTest";
import BlogPage from "@/components/hero-section/page";
import { fetchNewsByRegion } from "@/services/api";
import type { Article } from "@/types/article";
import { ShimmerCardGrid } from "@/components/ui/shimmer-grid";

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

  return (
    <>
      <BlogPage />
      <div className="max-w-(--breakpoint-xl) mx-auto py-8 px-6 xl:px-0">
        {loading && <ShimmerCardGrid count={6} />}
        {!loading && error && (
          <div className="py-8">
            <p className="text-lg text-destructive">Error: {error}</p>
          </div>
        )}
        {!loading && !error && <Blog02Page articles={articles} />}
      </div>
    </>
  );
}
