import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/app/components/Navbar";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { mockForms } from "@/data/mockForms";
import { ArrowLeft, Send, FileText, Calendar, Hash } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function FormView() {
  const { id } = useParams<{ id: string }>();
  const form = mockForms.find((f) => f.id === id);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!form) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <div className="mx-auto max-w-md animate-fade-in">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Form Not Found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The form you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/forms" className="mt-6 inline-block">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Back to My Forms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Form submitted successfully!",
        description: "This is a demo - no data was actually sent.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            to="/forms"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Forms
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {form.title}
              </h1>
              <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
                {form.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <Calendar className="h-4 w-4" />
                {form.createdAt}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <Hash className="h-4 w-4" />
                {form.fields.length} fields
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="space-y-6">
                {form.fields.map((field, index) => (
                  <div
                    key={field.id}
                    style={{ animationDelay: `${(index + 2) * 50}ms` }}
                  >
                    <FormField
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">
                  * Required fields
                </p>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isSubmitting}
                  className="group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                      <span>Submit Form</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
