"use client";

import { useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Zap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Create forms in seconds with AI",
  },
  {
    icon: Shield,
    title: "Smart Validation",
    description: "Auto-detect field types and rules",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "No more manual form building",
  },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSchema, setFormSchema] = useState<any>(null);

  const generateForm = async () => {
    if (!prompt.trim()) {
      alert("Please enter a form description");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();
      console.log("Generated Form:", data);

      setFormSchema(data);

      // Save form to localStorage
      const forms = JSON.parse(localStorage.getItem("forms") || "[]");
      forms.push({ ...data, createdAt: Date.now() });
      localStorage.setItem("forms", JSON.stringify(forms));
    } catch (error) {
      alert("Failed to generate form");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Form Builder</span>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Build Forms with{" "}
              <span className="text-gradient">Natural Language</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Describe your form in plain English and let AI create it for you.
              No coding, no drag-and-drop — just describe and generate.
            </p>
          </div>

          {/* Features */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-xl bg-card/80 p-4 shadow-card backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Describe Your Form
              </h2>
              <p className="mt-2 text-muted-foreground">
                Tell us what kind of form you need and we'll generate it for you
              </p>
            </div>

            <div className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a contact form with name, email, phone number, and a message field..."
                className="min-h-[200px] resize-none text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex items-center gap-4">
                <Button
                  onClick={generateForm}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? "Generating..." : "Generate Form"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>

                <p className="text-sm text-muted-foreground">
                  {prompt.length} characters
                </p>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Customer feedback survey",
                  "Job application form",
                  "Event registration",
                  "Newsletter signup",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() =>
                      setPrompt(
                        `Create a ${example.toLowerCase()} form with relevant fields`
                      )
                    }
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <PreviewPanel
              isEmpty={!formSchema}
              formSchema={formSchema}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
