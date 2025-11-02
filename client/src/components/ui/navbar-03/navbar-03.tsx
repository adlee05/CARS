import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ArrowUpRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const Navbar03Page = () => {
  let isLoggedIn = true;
  const GetStartedButton = () => {
    return (
      <>
        <Button asChild>
          <Link to="/login">
            Get Started <ArrowUpRight />
          </Link>
        </Button>
      </>
    );
  };
  const AvatarButton = () => {
    return (
      <>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </>
    );
  };
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }

  return (
    <div className="">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-(--breakpoint-lg) mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />

            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" />
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            {isLoggedIn ? <AvatarButton /> : <GetStartedButton />}
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar03Page;
