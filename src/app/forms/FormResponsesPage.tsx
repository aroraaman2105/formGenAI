import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function FormResponsesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [responses, setResponses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);


 useEffect(() => {
  Promise.all([
    fetch(`http://localhost:5000/api/forms/${id}`).then(res => res.json()),
    fetch(`http://localhost:5000/api/forms/${id}/responses`).then(res => res.json())
  ])
    .then(([formData, responseData]) => {
      setForm(formData);
      setResponses(responseData.responses);
      setTotal(responseData.total);
      setLoading(false);
    })
    .catch(console.error);
}, [id]);


  if (loading) {
    return <p className="p-8">Loading responses...</p>;
  }

  const buildChartData = (field: any) => {
  const counts: Record<string, number> = {};

  responses.forEach((response) => {
    const value = response.answers[field.id];

    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        counts[v] = (counts[v] || 0) + 1;
      });
    } else {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }));
};

const exportToCSV = () => {
  if (!form || responses.length === 0) return;

  // Header row
  const headers = form.fields.map((f: any) => f.label);
  headers.push("Submitted At");

  // Rows
  const rows = responses.map((response) => {
    const row = form.fields.map((field: any) => {
      const value = response.answers[field.id];
      if (Array.isArray(value)) return value.join(" | ");
      return value ?? "";
    });

    row.push(new Date(response.submittedAt).toLocaleString());
    return row;
  });

  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${form.title}-responses.csv`;
  link.click();

  URL.revokeObjectURL(url);
};



  return (
    <div className="min-h-screen bg-muted/30 p-10">
      <div className="mx-auto max-w-6xl bg-background p-8 rounded-xl shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold">Responses</h1>
    <p className="text-muted-foreground">
      Total responses: {total}
    </p>
  </div>

  <div className="flex gap-2">
    <Button
      variant="outline"
      onClick={() => navigate(`/forms/${id}`)}
    >
      View Form
    </Button>

    <Button
      onClick={exportToCSV}
      disabled={responses.length === 0}
    >
      Export CSV
    </Button>
  </div>
</div>



        {/* 📊 RESPONSE CHARTS */}
{form && (
  <div className="mb-10 space-y-10">
    <h2 className="text-2xl font-semibold">Analytics</h2>

    {form.fields
      .filter((field: any) =>
        ["radio", "select", "checkbox"].includes(field.type)
      )
      .map((field: any) => {
        const data = buildChartData(field);

        if (data.length === 0) return null;

        return (
          <div
            key={field.id}
            className="rounded-lg border bg-background p-6"
          >
            <h3 className="mb-4 text-lg font-medium">
              {field.label}
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
  </div>
)}


        {/* Table */}
        {responses.length === 0 ? (
          <p className="text-muted-foreground">
            No responses yet.
          </p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {Object.keys(responses[0].answers).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-sm font-semibold"
                    >
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Submitted At
                  </th>
                </tr>
              </thead>

              <tbody>
                {responses.map((response, index) => (
                  <tr
                    key={response._id}
                    className={index % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    {Object.values(response.answers).map(
                      (value: any, i: number) => (
                        <td key={i} className="px-4 py-3 text-sm">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : value}
                        </td>
                      )
                    )}
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
