import { useEffect, useState } from "react";
import { getBookmarks, removeBookmark, addBookmark, redirectToArticle } from "@/services/api";
import type { Bookmark } from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function ProfileContent() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkByArticle, setBookmarkByArticle] = useState<Record<number, string | undefined>>({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const rows = await getBookmarks();
        setBookmarks(rows);
        const map: Record<number, string> = {};
        rows.forEach((b) => {
          const aid = Number(b.article_id);
          if (!Number.isNaN(aid)) map[aid] = b.id;
        });
        setBookmarkByArticle(map);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="py-6">Loading bookmarks...</div>;
  if (!bookmarks.length)
    return <div className="py-6 text-muted-foreground">No bookmarks yet.</div>;

  const handleReadMore = async (articleId?: string) => {
    if (!articleId) return;
    try {
      const url = await redirectToArticle(Number(articleId));
      navigate(url);
    } catch (e) {
      // fallback to internal article page
      navigate(`/article/${articleId}`);
    }
  };

  const toggleBookmark = async (b: Bookmark) => {
    const aid = b.article_id ? Number(b.article_id) : NaN;
    const existingId = !Number.isNaN(aid) ? bookmarkByArticle[aid] : undefined;
    if (existingId) {
      await removeBookmark(existingId);
      setBookmarks((prev) => prev.filter((x) => x.id !== existingId));
      if (!Number.isNaN(aid)) {
        setBookmarkByArticle((prev) => ({ ...prev, [aid]: undefined }));
      }
    } else {
      // Allow re-adding if removed from list (using saved fields)
      const row = await addBookmark({
        article_id: b.article_id,
        url: b.url || "",
        title: b.title,
        image: b.image,
        region: (b as any).region,
        published_date: (b as any).published_date,
      });
      setBookmarks((prev) => [row, ...prev]);
      if (!Number.isNaN(aid)) {
        setBookmarkByArticle((prev) => ({ ...prev, [aid]: row.id }));
      }
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((b) => (
        <Card
          key={b.id}
          className="shadow-none overflow-hidden rounded-md py-0 flex flex-col h-full"
        >
          <CardHeader className="p-0">
            {b.image ? (
              <img
                src={b.image}
                alt={b.title || b.url}
                className="aspect-video w-full object-cover border-b"
              />
            ) : (
              <div className="aspect-video bg-muted w-full border-b" />
            )}
          </CardHeader>
          <CardContent className="pb-6 flex flex-col flex-1">
            <div className="flex items-center gap-3">
              {(b as any).region ? (
                <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                  {(b as any).region}
                </Badge>
              ) : null}
              {(b as any).published_date ? (
                <span className="font-medium text-xs text-muted-foreground">
                  {format(new Date((b as any).published_date), "MMM d, yyyy")}
                </span>
              ) : null}
            </div>
            <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
              {b.title || b.url}
            </h3>
            <div className="flex gap-[10px] mt-auto pt-4 flex-row justify-between">
              <Button
                size="sm"
                className="shadow-none cursor-pointer"
                onClick={() => handleReadMore(b.article_id)}
              >
                Read more
              </Button>
              <Button
                size="sm"
                className="shadow-none cursor-pointer"
                onClick={() => toggleBookmark(b)}
              >
                {b.article_id && bookmarkByArticle[Number(b.article_id)] ? (
                  <BookmarkCheck />
                ) : (
                  <BookmarkIcon />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
