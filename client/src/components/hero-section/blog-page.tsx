import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { redirectToArticle } from "@/services/api";
import { useNavigate } from "react-router-dom";

import { FeaturedPostSidebarItem } from "./featured-post-sidebar-item";
import type { Article } from "@/types/article";

interface BlogPageProps {
  articles: Article[];
}

export default function BlogPage({ articles }: BlogPageProps) {
  const navigate = useNavigate();
  const handleReadMore = async (articleId: number) => {
    try {
      const url = await redirectToArticle(articleId);
      navigate(url);
    } catch (error) {
      console.error("Error redirecting to article:", error);
    }
  };
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-(--breakpoint-xl) mx-auto py-16 px-6 xl:px-0">
        <p className="text-center">Loading hero...</p>
      </div>
    );
  }
  const featuredArticle = articles[0];
  const sidebarArticles = articles.slice(1, 6);
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto py-16 px-6 xl:px-0">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="relative h-[400px] overflow-hidden rounded-lg shadow-lg md:h-[500px] lg:col-span-2">
          <img
            src={
              featuredArticle?.image || "https://placehold.co/600x400?text=."
            }
            alt={featuredArticle?.title || "Featured Article"}
            className="w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <Badge className="mb-2 w-fit bg-white/20 text-blue-400 backdrop-blur-sm">
              {featuredArticle?.region || "News"}
            </Badge>
            <h2 className="text-2xl leading-tight font-bold md:text-3xl m-0 p-0">
              <div
                onClick={() => {
                  handleReadMore(featuredArticle.id);
                }}
                className="cursor-pointer"
              >
                {featuredArticle?.title || "Loading..."}
              </div>
            </h2>
          </div>
        </div>

        {/* Other Featured Posts Sidebar */}
        <div className="bg-card text-card-foreground space-y-6 rounded-lg border p-6 lg:col-span-1">
          <h3 className="text-xl font-semibold">Other featured posts</h3>
          <div className="space-y-4">
            {sidebarArticles.map((article) => (
              <FeaturedPostSidebarItem
                key={article.id}
                imageSrc={
                  article.image || "https://placehold.co/600x400?text=."
                }
                imageAlt={article.title}
                title={article.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
