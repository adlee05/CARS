import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ArrowUpRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import Logo from "@/components/reuse/Logo";

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
        <Link to="/profile">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  };
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  isLoggedIn = !!isAuthenticated;

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth_token");
    } catch {}
    navigate("/login");
  };

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
            {isLoggedIn ? (
              <>
                <AvatarButton />
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <GetStartedButton />
            )}
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
