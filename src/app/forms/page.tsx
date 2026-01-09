"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Calendar } from "lucide-react";
import { Navbar } from "@/app/components/Navbar";


interface Form {
  _id: string;
  title: string;
  description: string;
  fields: any[];
  createdAt: string;
}

export default function MyFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔒 ROUTE GUARD — MUST RUN FIRST
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/forms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setForms(data);
      })
      .catch(console.error);
  }, [navigate]);

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <Navbar />
      {/* Header */}
      <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your generated forms
          </p>
        </div>

        <Button onClick={() => navigate("/")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <Input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Forms Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <div
            key={form._id}
            onClick={() => navigate(`/forms/${form._id}`)}
            className="cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold">{form.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {form.description}
            </p>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(form.createdAt).toLocaleDateString()}
              </div>
              <span>{form.fields.length} fields</span>
            </div>

            {/* 🔹 ACTION BUTTONS (FEATURE 0) */}
            {/* 🔹 ACTION BUTTONS */}
            <div className="mt-5 space-y-3">
              {/* Primary Action */}
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/forms/${form._id}/responses`);
                }}
              >
                View Responses
              </Button>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/forms/${form._id}`);
                    }}
                  >
                    Open
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/forms/${form._id}/edit`);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = `${window.location.origin}/f/${form._id}`;
                      navigator.clipboard.writeText(link);
                    }}
                  >
                    Share
                  </Button>
                </div>

                {/* Danger Action */}
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={async (e) => {
                    e.stopPropagation();

                    const confirmDelete = window.confirm(
                      "Delete this form and all its responses?"
                    );
                    if (!confirmDelete) return;

                    const token = localStorage.getItem("token");

                    await fetch(`http://localhost:5000/api/forms/${form._id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    setForms((prev) => prev.filter((f) => f._id !== form._id));
                  }}
                >
                  🗑
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredForms.length === 0 && (
          <p className="text-muted-foreground mt-10">No forms found.</p>
        )}
      </div>
     </div> 
    </div>
  );
}
