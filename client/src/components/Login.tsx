import { AppWindowIcon, CodeIcon } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import "./Login.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ModeToggle from "./mode-toggle.tsx";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function Login() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BackgroundRippleEffect rows={16} />
      <div className="relative z-10">
        <ModeToggle />
      </div>
      <h1>Curatr</h1>
      <div className="min-h-190 flex justify-center items-center">
        <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
          <Tabs defaultValue="Login">
            <TabsList font-mono>
              <TabsTrigger value="Login">Login</TabsTrigger>
              <TabsTrigger value="SignUp">SignUp</TabsTrigger>
            </TabsList>
            <TabsContent value="Login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Welcome Back! Sign In to continue reading.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-name">Email</Label>
                    <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-username">Password</Label>
                    <Input id="tabs-demo-username" defaultValue="@peduarte" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Submit</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="SignUp">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>
                    Create a new account to access Curatr.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-current">Email</Label>
                    <Input id="tabs-demo-current" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-new">New password</Label>
                    <Input id="tabs-demo-new" type="password" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-new">Confirm password</Label>
                    <Input id="tabs-demo-new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="">Create Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
}
