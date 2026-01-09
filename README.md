# 🚀 FormGenAI — AI Powered Form Builder Platform

FormGenAI is a full-stack web application that allows users to generate dynamic, customizable forms using natural language. Instead of manually designing forms, users describe their requirements in plain English and the AI generates a complete form schema instantly.

The platform supports form sharing, response collection, analytics, authentication, and email notifications — making it a real-world, production-ready SaaS-style application.

---

## 🧠 What Problem Does FormGenAI Solve?

Creating forms manually is:
- Time-consuming
- Repetitive
- Error-prone
- Requires technical knowledge

**FormGenAI solves this by:**
- Letting users describe forms in natural language
- Automatically generating structured form fields
- Managing responses and analytics centrally
- Providing secure access to form owners

---

## ✨ Key Features

### 🤖 AI-Powered Form Generation
- Generate forms using plain English prompts
- AI converts prompt → structured JSON schema
- Supported field types:
  - Text
  - Email
  - Textarea
  - Radio buttons
  - Checkboxes
  - Dropdown (Select)

---

### 📄 Form Management
- View all generated forms in **My Forms**
- Edit form title, description, and fields
- Delete forms (with automatic response cleanup)
- Forms stored persistently in MongoDB

---

### 🌐 Public Form Sharing
- Each form has a public shareable link
- Anyone with the link can submit responses
- No login required for form respondents

---

### 📊 Responses & Analytics
- All responses stored in database
- View responses per form
- Charts:
  - Bar charts
  - Pie charts
- Export responses as CSV

---

### 🔐 Authentication & Authorization
- Single-owner authentication system
- JWT-based authentication
- Only the owner can:
  - View responses
  - Access analytics
  - Edit or delete forms
- Public users can only submit forms

---

### 📧 Email Notifications
- Owner receives email when:
  - A new form is generated
  - A user submits a response
- Implemented using Nodemailer
- Production-safe email handling

---

### 🌗 UI / UX
- Light & Dark theme support
- Responsive design
- Clean, modern interface
- Accessible components
- Smooth navigation and feedback

---

## 🛠️ Tech Stack

### Frontend (Focus Area)
- **React**  
  Component-based UI for modular, reusable interfaces

- **Vite**  
  Lightning-fast development server and optimized production builds

- **TypeScript**  
  Static typing for better scalability, maintainability, and bug prevention

- **Tailwind CSS**  
  Utility-first styling for rapid UI development

- **shadcn/ui**  
  Accessible, reusable UI components

- **React Router**  
  Client-side routing for SPA navigation

---

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Groq AI API** (LLM-based form generation)
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for email notifications

---

### Deployment
- **Frontend:** Vercel
- **Backend:** Render / Railway
- **Database:** MongoDB Atlas

---



