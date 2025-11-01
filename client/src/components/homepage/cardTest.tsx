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
import { Link } from "react-router-dom";

const Blog02Page = () => {
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto py-16 px-6 xl:px-0">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
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
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Card key={i} className="shadow-none overflow-hidden rounded-md py-0">
            <CardHeader className="p-0">
              <div className="aspect-video w-full border-b">
                <img className="object-cover h-full w-full" src="https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/2c69/live/ad7c2640-b239-11f0-ba75-093eca1ac29b.jpg" />
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
                  Technology
                </Badge>
                <span className="font-medium text-xs text-muted-foreground">
                  5 min read
                </span>
              </div>

              <Link to="/article">
                <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
                  A beginner&apos;s guide to blockchain for engineers
                </h3>
              </Link>

              <p className="mt-2 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros.
              </p>

              <Button size="sm" className="mt-6 shadow-none">
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
