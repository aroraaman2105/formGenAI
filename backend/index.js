import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import Form from "./models/Form.js";
import Response from "./models/Response.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import auth from "./middleware/auth.js";


dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/generate-form", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an expert form designer.
Return ONLY valid JSON.
No markdown. No explanation.

Schema:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "fields": [
    {
      "id": "string",
      "label": "string",
      "type": "text | email | textarea | radio | checkbox | select",
      "required": boolean,
      "options": string[]
    }
  ]
}
          `,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const rawText = completion.choices[0].message.content;
    console.log("RAW AI RESPONSE:\n", rawText);

    const json = JSON.parse(rawText);

    
    const savedForm = await Form.create({
      title: json.title,
      description: json.description,
      fields: json.fields,
    });

    res.json(savedForm);

  } catch (error) {
    console.error("FORM GENERATION ERROR:", error.message);
    res.status(500).json({
      error: "Form generation failed",
      details: error.message,
    });
  }
});

// 🔹 GET ALL FORMS (My Forms page)
app.get("/api/forms",auth, async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch forms",
      details: error.message,
    });
  }
});

// 🔹 GET SINGLE FORM BY ID
app.get("/api/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch form",
      details: error.message,
    });
  }
});

// 🔹 SAVE FORM RESPONSE
app.post("/api/forms/:id/responses", async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: "Answers are required" });
    }

    const response = await Response.create({
      formId: id,
      answers,
    });

    res.status(201).json({
      message: "Response saved successfully",
      response,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to save response",
      details: error.message,
    });
  }
});


// 🔹 GET RESPONSES FOR A FORM (OWNER VIEW)
app.get("/api/forms/:id/responses", async (req, res) => {
  try {
    const { id } = req.params;

    const responses = await Response.find({ formId: id }).sort({
      submittedAt: -1,
    });

    res.json({
      total: responses.length,
      responses,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch responses",
      details: error.message,
    });
  }
});



app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if owner already exists
    const existingOwner = await User.findOne({});
    if (existingOwner) {
      return res.status(403).json({
        error: "Owner already exists",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create owner
    await User.create({
      email,
      password: hashedPassword,
    });

    res.json({ message: "Owner registered successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find owner by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // 2️⃣ Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // 3️⃣ Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.put("/api/forms/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, fields } = req.body;

    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { title, description, fields },
      { new: true }
    );

    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/forms/:id", auth, async (req, res) => {
  try {
    console.log("🗑 Delete request for form:", req.params.id);

    await Response.deleteMany({ formId: req.params.id });
    await Form.findByIdAndDelete(req.params.id);

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("❌ Delete failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});




app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
