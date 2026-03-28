import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";

export function Layout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className={`pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[calc(100vh-4rem)] ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
      <footer className="border-t border-border/50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CareerAI — AI-powered career tools</p>
          <p className="text-center sm:text-right">
            <span className="font-medium text-foreground/70">Deploying?</span>{" "}
            Set your <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono">OPENAI_API_KEY</code>{" "}
            environment variable in your hosting provider (e.g. Vercel → Project Settings → Environment Variables).
          </p>
        </div>
      </footer>
    </div>
  );
}
