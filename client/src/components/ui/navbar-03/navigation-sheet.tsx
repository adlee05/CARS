import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "./config";
import Logo from "@/components/reuse/Logo";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-3">
        <Logo />

        <div className="mt-12 text-base space-y-4">
          <Link to="/home" className="inline-block">
            Home
          </Link>

          <div>
            <div className="font-bold">Food</div>
            <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
              {categories.map((category) => (
                <li key={category.title}>
                  <Link to="#" className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
