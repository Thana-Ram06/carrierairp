import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/Layout";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/button";
import { OutputCard } from "@/components/ui/OutputCard";
import { DataLossWarning } from "@/components/DataLossWarning";
import { useGenerateResume } from "@workspace/api-client-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  skills: z.string().min(2, "At least one skill is required"),
  experience: z.string().min(10, "Please describe your experience briefly"),
  education: z.string().min(5, "Education is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResumeGenerator() {
  const [output, setOutput] = useState<string | null>(null);
  
  const { mutate: generateResume, isPending } = useGenerateResume({
    mutation: {
      onSuccess: (data) => {
        setOutput(data.resume);
      },
      onError: (error) => {
        console.error("Failed to generate resume:", error);
        // Fallback or error state could be handled by a toast in a fuller implementation
        setOutput("An error occurred while generating the resume. Please check your API key and try again.");
      }
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    generateResume({ data });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-serif mb-3">Resume Generator</h1>
          <p className="text-muted-foreground text-lg">
            Provide your details below and our AI will format a professional, ATS-friendly resume.
          </p>
        </header>

        <DataLossWarning />

        <div className="glass-card rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Full Name" 
                placeholder="Jane Doe" 
                {...register("name")} 
                error={errors.name?.message}
              />
              <FormInput 
                label="Key Skills (comma separated)" 
                placeholder="React, TypeScript, Node.js, Design Systems" 
                {...register("skills")} 
                error={errors.skills?.message}
              />
            </div>
            
            <FormTextarea 
              label="Work Experience" 
              placeholder="E.g. 3 years as a Frontend Developer at Acme Corp building React applications... bullet points work best." 
              {...register("experience")} 
              error={errors.experience?.message}
              className="min-h-[160px]"
            />
            
            <FormTextarea 
              label="Education" 
              placeholder="B.S. in Computer Science, University of Technology, 2020" 
              {...register("education")} 
              error={errors.education?.message}
              className="min-h-[100px]"
            />

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" size="lg" isLoading={isPending} className="w-full sm:w-auto">
                {isPending ? "Generating Magic..." : "Generate Resume"}
              </Button>
            </div>
          </form>
        </div>

        {output && (
          <OutputCard 
            title="Generated Resume" 
            content={output} 
          />
        )}
      </div>
    </Layout>
  );
}
