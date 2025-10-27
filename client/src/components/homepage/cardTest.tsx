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
import { ChevronRight } from "lucide-react";
import type { Article } from "@/types/article";
import { format } from "date-fns";

interface Blog02PageProps {
  articles: Article[];
}

const Blog02Page = ({ articles }: Blog02PageProps) => {
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
          <Card key={article.id} className="shadow-none overflow-hidden rounded-md py-0">
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
                  {format(new Date(article.published_date), 'MMM d, yyyy')}
                </span>
              </div>

              <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
                {article.title}
              </h3>
              <p className="mt-2 text-muted-foreground line-clamp-2">
                {article.content}
              </p>

              <Button size="sm" className="mt-6 shadow-none" onClick={() => window.open(article.url, '_blank')}>
                Read more <ChevronRight />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog02Page;
