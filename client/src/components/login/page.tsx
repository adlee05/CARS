import { TabsComp } from "./tabs";
import SplitText from "@/components/SplitText";
import { FlickeringGrid } from "../ui/shadcn-io/flickering-grid/index";

export default function Login() {
  return (
    <>
      <FlickeringGrid
        className="absolute -z-10 inset-0"
        squareSize={7}
        gridGap={6}
        flickerChance={0.3}
        color="rgb(100, 100, 100)"
        maxOpacity={0.2}
      />
      <div className="relative flex flex-col items-center justify-center min-h-150 gap-[10px]">
        <SplitText
          text="Curatr"
          className="text-5xl font-semibold text-center"
          delay={100}
          duration={0.9}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={() => {}}
        />
        <p>Intelligent News for the Informed Mind.</p>
        <TabsComp />
      </div>
    </>
  );
}
