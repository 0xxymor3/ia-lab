import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Mermaid } from "@/components/mermaid";

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose-lab ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {children}
            </a>
          ),
          pre: ({ children }) => {
            // Les blocs ```mermaid sont rendus en diagramme.
            if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
              const { className: cls, children: code } = children.props;
              if (cls?.includes("language-mermaid")) return <Mermaid chart={String(code).trim()} />;
            }
            return <pre>{children}</pre>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
