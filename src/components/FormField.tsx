import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormFieldConfig {
  id: string;
  type: "text" | "email" | "textarea" | "radio" | "checkbox" | "select";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: (string | { label: string; value: string })[];
}

interface FormFieldProps {
  field: FormFieldConfig;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
}

export function FormField({ field, value, onChange, className }: FormFieldProps) {
  const handleChange = (newValue: string | string[]) => {
    onChange?.(newValue);
  };

  const normalizedOptions =
    field.options?.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    ) || [];

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input
            id={field.id}
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={field.id}
            required={field.required}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case "radio":
        return (
          <RadioGroup
            value={(value as string) || ""}
            onValueChange={handleChange}
            className="flex flex-col gap-3"
          >
            {normalizedOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        const selectedValues = (value as string[]) || [];
        return (
          <div className="flex flex-col gap-3">
            {normalizedOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value);
                    handleChange(newValues);
                  }}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "select":
        return (
          <Select
            value={(value as string) || ""}
            onValueChange={handleChange}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {normalizedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
      </Label>
      {renderField()}
    </div>
  );
}
