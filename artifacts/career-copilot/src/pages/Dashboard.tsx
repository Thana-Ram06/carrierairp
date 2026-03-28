import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ArrowRight, Sparkles, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    id: "generator",
    title: "Resume Generator",
    description: "Input your basic details and experience to generate a complete, professional, ATS-friendly resume from scratch.",
    icon: Sparkles,
    href: "/resume-generator",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: "improver",
    title: "Resume Improver",
    description: "Paste your existing resume text. Our AI will rewrite, format, and enhance it to sound more impactful.",
    icon: FileText,
    href: "/resume-improver",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: "interview",
    title: "Interview Prep",
    description: "Enter a job role and your skills to generate likely interview questions and suggested professional answers.",
    icon: MessageSquare,
    href: "/interview",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-3">Welcome to your Toolkit</h1>
          <p className="text-muted-foreground text-lg">Select a tool below to accelerate your career preparation.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <Link key={tool.id} href={tool.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="h-full group cursor-pointer glass-card rounded-3xl p-6 border border-border hover:border-primary/40 transition-all duration-300 flex flex-col"
              >
                <div className={`w-12 h-12 rounded-2xl ${tool.bg} ${tool.color} flex items-center justify-center mb-6`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                  {tool.description}
                </p>

                <div className="flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors mt-auto">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
