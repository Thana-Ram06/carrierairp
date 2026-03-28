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
    </div>
  );
}
