import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";

export default function SingleFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `http://localhost:5000/api/forms/${id}/responses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: values }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to submit response");
    }

    alert("Response submitted successfully!");
    setValues({});
  } catch (error) {
    alert("Submission failed");
    console.error(error);
  }
};


  if (loading) return <p className="p-8">Loading form...</p>;
  if (!form) return <p className="p-8">Form not found</p>;

  return (
    <div className="min-h-screen bg-muted/30 p-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-background p-8 shadow">
        <h1 className="text-3xl font-bold">{form.title}</h1>
        <p className="mt-2 text-muted-foreground">{form.description}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {form.fields.map((field: any) => (
            <FormField
              key={field.id}
              field={field}
              value={values[field.id]}
              onChange={(value) => handleChange(field.id, value)}
            />
          ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
