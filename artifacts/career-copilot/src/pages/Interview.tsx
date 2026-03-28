import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/Layout";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { OutputCard } from "@/components/ui/OutputCard";
import { DataLossWarning } from "@/components/DataLossWarning";
import { useGenerateInterviewQuestions } from "@workspace/api-client-react";

const formSchema = z.object({
  role: z.string().min(2, "Job role is required"),
  skills: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Interview() {
  // Store the raw output to render structured UI
  const [questions, setQuestions] = useState<{question: string, answer: string}[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { mutate: generateQuestions, isPending } = useGenerateInterviewQuestions({
    mutation: {
      onSuccess: (data) => {
        setQuestions(data.questions);
        setErrorMsg(null);
      },
      onError: (error) => {
        console.error("Failed to generate questions:", error);
        setErrorMsg("An error occurred while generating questions. Please check your API key and try again.");
      }
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    generateQuestions({ data });
  };

  // Build raw text for the clipboard copy feature
  const rawTextForCopy = questions 
    ? questions.map((q, i) => `Q${i+1}: ${q.question}\n\nA: ${q.answer}`).join("\n\n---\n\n")
    : "";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-serif mb-3">Interview Prep</h1>
          <p className="text-muted-foreground text-lg">
            Get AI-generated interview questions and perfect answers tailored to your target role.
          </p>
        </header>

        <DataLossWarning />

        <div className="glass-card rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput 
              label="Target Role / Job Title" 
              placeholder="e.g. Senior Product Designer, React Developer" 
              {...register("role")} 
              error={errors.role?.message}
            />
            
            <FormTextarea 
              label="Relevant Skills or Job Description (Optional)" 
              placeholder="Paste key skills or the job description to get more tailored questions..." 
              {...register("skills")} 
              error={errors.skills?.message}
              className="min-h-[120px]"
            />

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" size="lg" isLoading={isPending} className="w-full sm:w-auto">
                {isPending ? "Generating Questions..." : "Generate Prep Guide"}
              </Button>
            </div>
          </form>
        </div>

        {errorMsg && (
          <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
            {errorMsg}
          </div>
        )}

        {questions && (
          <OutputCard 
            title="Interview Prep Guide" 
            rawTextToCopy={rawTextForCopy}
            content={
              <div className="space-y-8 mt-2">
                {questions.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-serif text-lg font-bold text-foreground flex gap-3">
                      <span className="text-primary select-none">Q{index + 1}.</span> 
                      <span>{item.question}</span>
                    </h4>
                    <div className="pl-8 text-muted-foreground border-l-2 border-primary/20 ml-2">
                      <p className="leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            } 
          />
        )}
      </div>
    </Layout>
  );
}
