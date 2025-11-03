import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";

export default function ProfileHeader() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Profile"
              />
              <AvatarFallback className="text-2xl">USR</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">Hello There</h1>
              <Badge variant="secondary">Early Bird</Badge>
            </div>
            <p className="text-muted-foreground">Welcome back to your profile</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
