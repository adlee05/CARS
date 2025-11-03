import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/article/header";
import { Content } from "@/components/article/content";
import { fetchArticle } from "@/services/api";
import type { Article } from "@/types/article";
import ArticleShimmer from "@/components/article/article-shimmer";

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setError("Article ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticle(id);
        setArticle(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article"
        );
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  // Format date from ISO string to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Split content into paragraphs
  const splitContent = (content: string): string[] => {
    // Split by double newlines first, then by single newlines, filter out empty strings
    return content
      .split(/\n\s*\n/)
      .flatMap((para) => para.split(/\n/))
      .map((para) => para.trim())
      .filter((para) => para.length > 0);
  };

  if (loading) {
    return <ArticleShimmer />;
  }

  if (error || !article) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Article not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline">
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Header
          category={article.region || article.source || "News"}
          title={article.title}
          author={{
            name: article.source || "Unknown",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          publishedDate={formatDate(article.published_date)}
          onBack={() => navigate("/")}
        />

        <div className="mt-16">
          <Content
            content={splitContent(article.content)}
            coverImage={article.image}
          />
        </div> 
      </div>
    </div>
  );
}
