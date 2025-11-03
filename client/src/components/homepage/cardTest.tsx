import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/types/article";
import { format } from "date-fns";
import { redirectToArticle, addBookmark, getBookmarks, removeBookmark } from "@/services/api";
import { useEffect, useState } from "react";

interface Blog02PageProps {
  articles: Article[];
}

const Blog02Page = ({ articles }: Blog02PageProps) => {
  const navigate = useNavigate();
 const handleReadMore = async (articleId: number) => {
    try {
      const url = await redirectToArticle(articleId);
      navigate(url);
    } catch (error) {
      console.error("Error redirecting to article:", error);
    }
  };

  const [bookmarkByArticle, setBookmarkByArticle] = useState<Record<number, string | undefined>>({});

  useEffect(() => {
    (async () => {
      try {
        const rows = await getBookmarks();
        const map: Record<number, string> = {};
        rows.forEach((b) => {
          const aid = Number(b.article_id);
          if (!Number.isNaN(aid)) map[aid] = b.id;
        });
        setBookmarkByArticle(map);
      } catch (e) {
        // ignore if not logged in or request fails
      }
    })();
  }, []);

  const toggleBookmark = async (article: Article) => {
    const current = bookmarkByArticle[article.id];
    if (current) {
      await removeBookmark(current);
      setBookmarkByArticle((prev) => ({ ...prev, [article.id]: undefined }));
    } else {
      const row = await addBookmark({
        article_id: article.id,
        url: article.url,
        title: article.title,
        image: article.image,
        region: article.region,
        published_date: article.published_date,
      });
      setBookmarkByArticle((prev) => ({ ...prev, [article.id]: row.id }));
    }
  };

  return (
    <div className="max-w-(--breakpoint-xl) mx-auto py-8 px-6 xl:px-0">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold tracking-tight">News Articles</h2>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="shadow-none overflow-hidden rounded-md py-0 flex flex-col h-full"
          >
            <CardHeader className="p-0">
              <img
                src={article.image}
                alt={article.title}
                className="aspect-video w-full object-cover border-b"
              />
            </CardHeader>
            <CardContent className="pb-6 flex flex-col flex-1">
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
              <div className="flex gap-[10px] mt-auto pt-4 flex-row justify-between">
                <Button
                  size="sm"
                  className="shadow-none cursor-pointer"
                  onClick={() => handleReadMore(article.id)}
                >
                  Read more <ChevronRight />
                </Button>
                <Button
                  size="sm"
                  className="shadow-none cursor-pointer"
                  onClick={() => toggleBookmark(article)}
                >
                  {bookmarkByArticle[article.id] ? (
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
