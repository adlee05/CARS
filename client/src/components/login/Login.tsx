import { GradientText } from "@/components/ui/shadcn-io/gradient-text/index";
import { FlickeringGrid } from "@/components/ui/shadcn-io/flickering-grid/index";
import Sample from "./sample";

export default function Login() {
  return (
    <>
      <div className="relative z-10 min-h-175 flex flex-col items-center justify-center">
        <Sample /> {/* Added margin-top for spacing */}
      </div>
      <FlickeringGrid
        className="absolute inset-0"
        squareSize={5}
        gridGap={6}
        flickerChance={0.3}
        color="rgb(100, 100, 100)"
        maxOpacity={0.2}
      />
    </>
  );
}
