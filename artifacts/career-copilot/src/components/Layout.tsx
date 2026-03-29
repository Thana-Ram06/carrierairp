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
            Made by{" "}
            <a
              href="https://x.com/anoinv?s=21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground underline-offset-2 hover:underline transition-colors duration-150"
            >
              me
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
