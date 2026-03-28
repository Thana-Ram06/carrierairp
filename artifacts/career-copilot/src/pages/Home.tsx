import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout className="flex flex-col items-center justify-center text-center">
      <div className="relative w-full max-w-4xl mx-auto mt-12 md:mt-20">
        
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Stateless AI Toolkit</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-serif text-balance leading-[1.1] text-foreground mb-6">
          Build your <span className="text-primary italic pr-2">AI-powered</span> career
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
          Generate professional ATS-friendly resumes, beautifully rewrite your existing experience, and practice for interviews tailored specifically to your role.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto group">
              Get Started 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/resume-generator">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Try Resume Builder
            </Button>
          </Link>
        </div>

        {/* Feature Teasers */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Generate Resumes", icon: Sparkles, desc: "Turn raw experience into polished, ATS-ready documents instantly." },
            { title: "Improve Writing", icon: FileText, desc: "Let AI rewrite your bullet points for maximum impact." },
            { title: "Mock Interviews", icon: MessageSquare, desc: "Get tailored questions and perfect answers for your dream role." }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="p-6 rounded-2xl glass-card border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
