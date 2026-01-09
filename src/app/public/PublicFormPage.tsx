"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";

export default function PublicFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}`)
      .then((res) => res.json())
      .then(setForm)
      .catch(console.error);
  }, [id]);

  const submitForm = async () => {
    await fetch(`http://localhost:5000/api/forms/${id}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });

    setSubmitted(true);
  };

  if (!form) return <p className="p-10">Loading...</p>;

  if (submitted) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Thank you!</h1>
        <p className="text-muted-foreground mt-2">
          Your response has been submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-10">
      <div className="mx-auto max-w-xl bg-background p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold">{form.title}</h1>
        <p className="text-muted-foreground mt-1">{form.description}</p>

        <div className="mt-6 space-y-6">
          {form.fields.map((field: any) => (
            <FormField
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(value) =>
                setAnswers((prev: any) => ({
                  ...prev,
                  [field.id]: value,
                }))
              }
            />
          ))}

          <Button onClick={submitForm} className="w-full">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
