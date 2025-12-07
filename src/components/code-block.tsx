'use client';

import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ 
            borderRadius: '0.5rem', 
            border: '1px solid hsl(var(--border))',
            margin: 0,
            fontSize: '0.875rem'
        }}
        codeTagProps={{
            style: {
                fontFamily: 'var(--font-code, monospace)'
            }
        }}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Copiar código"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
      </button>
    </div>
  );
}
