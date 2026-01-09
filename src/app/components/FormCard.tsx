import { Link } from "react-router-dom";
import { FileText, Calendar, Hash, ArrowRight } from "lucide-react";

interface FormCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  fieldCount: number;
}

export function FormCard({ id, title, description, createdAt, fieldCount }: FormCardProps) {
  return (
    <Link
      to={`/forms/${id}`}
      className="group block rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <FileText className="h-6 w-6" />
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {createdAt}
          </span>
          <span className="flex items-center gap-1">
            <Hash className="h-3.5 w-3.5" />
            {fieldCount} fields
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}
