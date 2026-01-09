"use client";

import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { FormField } from "@/components/FormField";

interface PreviewPanelProps {
  isEmpty?: boolean; // kept for compatibility, but not trusted
  formSchema?: any;
}

export function PreviewPanel({ formSchema }: PreviewPanelProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formSchema) return;

    for (const field of formSchema.fields || []) {
      if (field.required && !responses[field.id]) {
        alert(`Please fill required field: ${field.label}`);
        return;
      }
    }

    const allResponses = JSON.parse(
      localStorage.getItem("responses") || "{}"
    );

    const formId = formSchema._id || formSchema.title;

    allResponses[formId] = [
      ...(allResponses[formId] || []),
      {
        ...responses,
        submittedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("responses", JSON.stringify(allResponses));

    alert("Form submitted successfully!");
    setResponses({});
  };

  /* 🟢 EMPTY STATE — ONLY WHEN NO SCHEMA */
  if (!formSchema) {
    return (
      <div className="h-full rounded-xl border-2 border-dashed border-border bg-card/50 p-6">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Form Preview</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate a form to see the preview here
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI-powered generation</span>
          </div>
        </div>
      </div>
    );
  }

  /* 🟢 REAL FORM PREVIEW */
  return (
    <div className="h-full rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>Generated Form Preview</span>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{formSchema.title}</h2>

        {formSchema.description && (
          <p className="text-sm text-muted-foreground">
            {formSchema.description}
          </p>
        )}

        <form className="space-y-4">
          {formSchema.fields?.map((field: any) => (
            <FormField
              key={field.id}
              field={field}
              value={responses[field.id]}
              onChange={(value) => handleChange(field.id, value)}
            />
          ))}

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
