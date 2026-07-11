import { type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article" | "main" | "footer" | "header" | "nav";
}

export function Section({
  children,
  className = "",
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={className}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </Tag>
  );
}
