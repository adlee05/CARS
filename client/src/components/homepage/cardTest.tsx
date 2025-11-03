import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import type { Article } from "@/types/article";
import { format } from "date-fns";
import { redirectToArticle } from "@/services/api";
import { useState } from "react";

interface Blog02PageProps {
  articles: Article[];
}

const Blog02Page = ({ articles }: Blog02PageProps) => {
  const handleReadMore = async (articleId: number) => {
    try {
      const url = await redirectToArticle(articleId);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error redirecting to article:", error);
    }
  };

  const [bookmarkedArticles, setBookmarkedArticles] = useState({});

  return (
    <div className="max-w-(--breakpoint-xl) mx-auto py-16 px-6 xl:px-0">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold tracking-tight">News Articles</h2>
        <Select defaultValue="recommended">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="shadow-none overflow-hidden rounded-md py-0"
          >
            <CardHeader className="p-0">
              <img
                src={article.image}
                alt={article.title}
                className="aspect-video w-full object-cover border-b"
              />
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                  {article.region}
                </Badge>
                <span className="font-medium text-xs text-muted-foreground">
                  {format(new Date(article.published_date), "MMM d, yyyy")}
                </span>
              </div>

              <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
                {article.title}
              </h3>
              <p className="mt-2 text-muted-foreground line-clamp-2">
                {article.content}
              </p>
              <div className="flex gap-[10px]">
                <Button
                  size="sm"
                  className="mt-6 shadow-none cursor-pointer"
                  onClick={() => handleReadMore(article.id)}
                >
                  Read more <ChevronRight />
                </Button>
                <Button
                  size="sm"
                  className="mt-6 shadow-none cursor-pointer"
                  onClick={() => {
                    setBookmarkedArticles((prev) => ({
                      ...prev,
                      [article.id]: !prev[article.id], // Toggle only THIS article
                    }));
                  }}
                >
                  {bookmarkedArticles[article.id] ? (
                    <BookmarkCheck />
                  ) : (
                    <Bookmark />
                  )}
                </Button>{" "}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog02Page;
