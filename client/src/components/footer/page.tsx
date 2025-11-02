import { GithubIcon } from "lucide-react";

const teamMembers = [
  {
    name: "Arjun Manjunath",
    avartar: "https://avatars.githubusercontent.com/u/133084134?v=4",
    githubUrl: "https://github.com/arjunmnath",
  },
  {
    name: "Vaddi Rahul",
    avartar: "https://avatars.githubusercontent.com/u/166011011?v=4",
    githubUrl: "https://github.com/Rahulv-17",
  },
  {
    name: "Malampati Charan",
    avartar: "https://avatars.githubusercontent.com/u/165539819?v=4",
    githubUrl: "https://github.com/adlee05",
  },
  {
    name: "Sai Sushant Reddy",
    avartar: "https://avatars.githubusercontent.com/u/65782063?v=4",
    githubUrl: "https://github.com/#",
  },
];

const footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          <span className="text-muted-foreground">
            Copyright © {new Date().getFullYear()} Curatr. All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-muted-foreground">
            {teamMembers.map((member, index) => (
              <a
                key={index}
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label={`${member.name} GitHub`}
              >
                <img src={member.avartar} className="h-8 rounded-lg w-8" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
