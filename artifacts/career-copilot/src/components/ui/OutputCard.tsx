import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";

interface OutputCardProps {
  title?: string;
  content: string | React.ReactNode;
  rawTextToCopy?: string;
}

export function OutputCard({ title = "Result", content, rawTextToCopy }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = rawTextToCopy || (typeof content === 'string' ? content : '');
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden mt-8 border border-primary/20"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        {(rawTextToCopy || typeof content === 'string') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground hover:bg-background"
          >
            {copied ? (
              <span className="flex items-center gap-2 text-primary">
                <Check className="w-4 h-4" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="w-4 h-4" /> Copy
              </span>
            )}
          </Button>
        )}
      </div>
      <div className="p-6 md:p-8 bg-card text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
        {content}
      </div>
    </motion.div>
  );
}
