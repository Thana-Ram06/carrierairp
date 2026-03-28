import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Briefcase, LayoutDashboard, Sparkles, FileText, MessageSquare } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resume-generator", label: "Resume Builder", icon: Sparkles },
    { href: "/resume-improver", label: "Improver", icon: FileText },
    { href: "/interview", label: "Interview Prep", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-normal tracking-tight text-foreground">
              CareerAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-muted rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu could go here, but keeping it minimal for now */}
          <div className="md:hidden flex items-center">
             <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80">
               Dashboard
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
