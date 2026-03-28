import { AlertCircle } from "lucide-react";

export function DataLossWarning() {
  return (
    <div className="mb-6 flex items-start sm:items-center gap-3 p-4 rounded-xl bg-accent/50 border border-accent text-accent-foreground text-sm">
      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
      <p>
        <strong className="font-medium text-foreground">Note:</strong> Don't refresh the page — your generated data will be lost as this is a stateless tool.
      </p>
    </div>
  );
}
