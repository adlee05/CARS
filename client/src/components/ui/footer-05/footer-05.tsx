import { GithubIcon } from "lucide-react";

const teamMembers = [
  {
    name: "Team Member 1",
    githubUrl: "#",
  },
  {
    name: "Team Member 2",
    githubUrl: "#",
  },
  {
    name: "Team Member 3",
    githubUrl: "#",
  },
  {
    name: "Team Member 4",
    githubUrl: "#",
  },
];

const Footer05Page = () => {
  return (
    <footer className="border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground">
            Copyright © {new Date().getFullYear()} Curatr. All rights reserved.
          </span>

          {/* Team GitHub Links */}
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
                <GithubIcon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer05Page;
