import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shimmer } from "react-shimmer";

interface ShimmerCardGridProps {
  count?: number;
}

export function ShimmerCardGrid({ count = 6 }: ShimmerCardGridProps) {
  const placeholders = Array.from({ length: count });

  return (
    <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {placeholders.map((_, index) => (
        <Card key={index} className="shadow-none overflow-hidden rounded-md py-0">
          <CardHeader className="p-0">
            <div className="aspect-video w-full border-b">
              <Shimmer width="100%" height="100%" />
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-20 rounded-sm overflow-hidden">
                <Shimmer width="100%" height="100%" />
              </div>
              <div className="h-4 w-24 rounded-sm overflow-hidden">
                <Shimmer width="100%" height="100%" />
              </div>
            </div>
            <div className="mt-4 h-6 w-3/4 rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
            <div className="mt-2 h-4 w-full rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
            <div className="mt-2 h-4 w-5/6 rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ShimmerCardGrid;


