import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/Layout";
import { FormTextarea } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { OutputCard } from "@/components/ui/OutputCard";
import { DataLossWarning } from "@/components/DataLossWarning";
import { useImproveResume } from "@workspace/api-client-react";

const formSchema = z.object({
  resumeText: z.string().min(20, "Please paste more of your resume to improve"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResumeImprover() {
  const [output, setOutput] = useState<string | null>(null);
  
  const { mutate: improveResume, isPending } = useImproveResume({
    mutation: {
      onSuccess: (data) => {
        setOutput(data.improvedResume);
      },
      onError: (error) => {
        console.error("Failed to improve resume:", error);
        setOutput("An error occurred while improving the resume. Please check your API key and try again.");
      }
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    improveResume({ data });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-serif mb-3">Resume Improver</h1>
          <p className="text-muted-foreground text-lg">
            Paste your existing resume text. We'll rewrite it to sound more impactful and professional.
          </p>
        </header>

        <DataLossWarning />

        <div className="glass-card rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <FormTextarea 
              label="Paste your current resume" 
              placeholder="Paste bullet points, summary, or entire resume text here..." 
              {...register("resumeText")} 
              error={errors.resumeText?.message}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" size="lg" isLoading={isPending} className="w-full sm:w-auto">
                {isPending ? "Rewriting Professionally..." : "Improve Resume"}
              </Button>
            </div>
          </form>
        </div>

        {output && (
          <OutputCard 
            title="Improved Resume" 
            content={output} 
          />
        )}
      </div>
    </Layout>
  );
}
