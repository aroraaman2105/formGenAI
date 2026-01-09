"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FIELD_TYPES = [
  "text",
  "email",
  "textarea",
  "checkbox",
  "radio",
  "select",
];

export default function EditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  if (!form) return <p className="p-10">Loading...</p>;

  const updateField = (index: number, updates: any) => {
    const fields = [...form.fields];
    fields[index] = { ...fields[index], ...updates };
    setForm({ ...form, fields });
  };

  const deleteField = (index: number) => {
    const fields = form.fields.filter((_: any, i: number) => i !== index);
    setForm({ ...form, fields });
  };

  const addField = () => {
    setForm({
      ...form,
      fields: [
        ...form.fields,
        {
          id: crypto.randomUUID(),
          label: "New Field",
          type: "text",
          required: false,
          options: [],
        },
      ],
    });
  };

  const saveForm = async () => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/forms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        fields: form.fields,
      }),
    });

    navigate("/forms");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Form</h1>

      <Input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <Textarea
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* Fields */}
      <div className="space-y-6">
        {form.fields.map((field: any, index: number) => (
          <div
            key={field.id}
            className="rounded-lg border p-4 space-y-3"
          >
            <div className="flex gap-3">
              <Input
                value={field.label}
                onChange={(e) =>
                  updateField(index, { label: e.target.value })
                }
                placeholder="Field label"
              />

              <Select
                value={field.type}
                onValueChange={(val) =>
                  updateField(index, { type: val })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="destructive"
                onClick={() => deleteField(index)}
              >
                Delete
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.required}
                onCheckedChange={(v) =>
                  updateField(index, { required: Boolean(v) })
                }
              />
              <span className="text-sm">Required</span>
            </div>

            {(field.type === "checkbox" ||
              field.type === "radio" ||
              field.type === "select") && (
              <Textarea
                placeholder="Options (comma separated)"
                value={field.options?.join(", ") || ""}
                onChange={(e) =>
                  updateField(index, {
                    options: e.target.value
                      .split(",")
                      .map((o) => o.trim()),
                  })
                }
              />
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addField}>
        ➕ Add Field
      </Button>

      <Button onClick={saveForm}>Save Changes</Button>
    </div>
  );
}
