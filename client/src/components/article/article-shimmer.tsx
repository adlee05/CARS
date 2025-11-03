import { Shimmer } from "react-shimmer";

export default function ArticleShimmer() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header shimmer */}
        <div className="space-y-6">
          <div className="h-6 w-24 rounded-sm overflow-hidden">
            <Shimmer width="100%" height="100%" />
          </div>

          <div className="space-y-3">
            <div className="h-10 w-11/12 rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
            <div className="h-10 w-9/12 rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <Shimmer width="100%" height="100%" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 rounded-sm overflow-hidden">
                  <Shimmer width="100%" height="100%" />
                </div>
                <div className="h-3 w-28 rounded-sm overflow-hidden">
                  <Shimmer width="100%" height="100%" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 w-9 rounded-full overflow-hidden">
                  <Shimmer width="100%" height="100%" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content shimmer */}
        <div className="mt-16 space-y-6">
          <div className="bg-muted aspect-video w-full overflow-hidden rounded-xl">
            <Shimmer width="100%" height="100%" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-4 w-full rounded-sm overflow-hidden">
                <Shimmer width="100%" height="100%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


