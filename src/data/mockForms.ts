import { FormFieldConfig } from "@/components/FormField";

export interface MockForm {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  fields: FormFieldConfig[];
}

export const mockForms: MockForm[] = [
  {
    id: "1",
    title: "Customer Feedback Survey",
    description: "Collect valuable feedback from customers about their experience with our product and services.",
    createdAt: "Dec 25, 2024",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your@email.com",
        required: true,
      },
      {
        id: "rating",
        type: "radio",
        label: "How would you rate our service?",
        required: true,
        options: [
          { label: "Excellent", value: "excellent" },
          { label: "Good", value: "good" },
          { label: "Average", value: "average" },
          { label: "Poor", value: "poor" },
        ],
      },
      {
        id: "feedback",
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Share your thoughts with us...",
      },
    ],
  },
  {
    id: "2",
    title: "Job Application Form",
    description: "Standard job application form for collecting candidate information and qualifications.",
    createdAt: "Dec 24, 2024",
    fields: [
      {
        id: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "john@example.com",
        required: true,
      },
      {
        id: "position",
        type: "select",
        label: "Position Applied For",
        placeholder: "Select a position",
        required: true,
        options: [
          { label: "Software Engineer", value: "software-engineer" },
          { label: "Product Designer", value: "product-designer" },
          { label: "Product Manager", value: "product-manager" },
          { label: "Data Analyst", value: "data-analyst" },
        ],
      },
      {
        id: "experience",
        type: "radio",
        label: "Years of Experience",
        required: true,
        options: [
          { label: "0-2 years", value: "0-2" },
          { label: "3-5 years", value: "3-5" },
          { label: "6-10 years", value: "6-10" },
          { label: "10+ years", value: "10+" },
        ],
      },
      {
        id: "skills",
        type: "checkbox",
        label: "Technical Skills",
        options: [
          { label: "JavaScript/TypeScript", value: "js" },
          { label: "React", value: "react" },
          { label: "Node.js", value: "node" },
          { label: "Python", value: "python" },
          { label: "SQL", value: "sql" },
        ],
      },
      {
        id: "coverLetter",
        type: "textarea",
        label: "Cover Letter",
        placeholder: "Tell us why you're a great fit...",
      },
    ],
  },
  {
    id: "3",
    title: "Event Registration",
    description: "Registration form for upcoming tech conference with session preferences.",
    createdAt: "Dec 23, 2024",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Your Name",
        placeholder: "Enter your name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "you@company.com",
        required: true,
      },
      {
        id: "ticketType",
        type: "select",
        label: "Ticket Type",
        required: true,
        options: [
          { label: "Standard - $99", value: "standard" },
          { label: "Premium - $199", value: "premium" },
          { label: "VIP - $499", value: "vip" },
        ],
      },
      {
        id: "sessions",
        type: "checkbox",
        label: "Preferred Sessions",
        options: [
          { label: "AI & Machine Learning", value: "ai" },
          { label: "Web Development", value: "web" },
          { label: "Cloud Computing", value: "cloud" },
          { label: "Cybersecurity", value: "security" },
        ],
      },
      {
        id: "dietary",
        type: "radio",
        label: "Dietary Requirements",
        options: [
          { label: "No restrictions", value: "none" },
          { label: "Vegetarian", value: "vegetarian" },
          { label: "Vegan", value: "vegan" },
          { label: "Gluten-free", value: "gluten-free" },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Newsletter Subscription",
    description: "Simple newsletter signup form to grow your email list.",
    createdAt: "Dec 22, 2024",
    fields: [
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
      },
      {
        id: "interests",
        type: "checkbox",
        label: "Topics of Interest",
        options: [
          { label: "Product Updates", value: "product" },
          { label: "Industry News", value: "news" },
          { label: "Tips & Tutorials", value: "tutorials" },
          { label: "Case Studies", value: "cases" },
        ],
      },
    ],
  },
];
