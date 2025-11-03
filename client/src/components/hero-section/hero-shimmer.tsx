import { Shimmer } from "react-shimmer";

export default function HeroShimmer() {
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto py-16 px-6 xl:px-0">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Hero area */}
        <div className="relative h-[400px] overflow-hidden rounded-lg shadow-lg md:h-[500px] lg:col-span-2">
          <div className="w-full h-full">
            <Shimmer width="100%" height="100%" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="mb-3 h-6 w-24 rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
            <div className="h-10 w-3/4 md:w-2/3 rounded-sm overflow-hidden">
              <Shimmer width="100%" height="100%" />
            </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="bg-card text-card-foreground space-y-6 rounded-lg border p-6 lg:col-span-1">
          <div className="h-6 w-48 rounded-sm overflow-hidden">
            <Shimmer width="100%" height="100%" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <Shimmer width="100%" height="100%" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-11/12 rounded-sm overflow-hidden">
                    <Shimmer width="100%" height="100%" />
                  </div>
                  <div className="h-4 w-8/12 rounded-sm overflow-hidden">
                    <Shimmer width="100%" height="100%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


