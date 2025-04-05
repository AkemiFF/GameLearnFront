"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

interface TheoryContentProps {
  experimentId: string | null
  theoryContent: string | null
}

export function TheoryContent({ experimentId, theoryContent }: TheoryContentProps) {
  if (!experimentId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune expérience sélectionnée</h3>
        <p className="text-muted-foreground max-w-xs">
          Veuillez sélectionner une expérience pour afficher le contenu théorique.
        </p>
      </div>
    )
  }

  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Théorie scientifique
        </CardTitle>
        <CardDescription>Comprendre les concepts derrière l'expérience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="my-3" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-border" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => <thead className="bg-muted/50" {...props} />,
              th: ({ node, ...props }) => (
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider" {...props} />
              ),
              td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-nowrap" {...props} />,
              tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md my-4"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              },
              img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-md my-4" {...props} />,
              hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
            }}
          >
            {theoryContent || ""}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

