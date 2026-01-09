import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: String,
  required: Boolean,
  options: [String],
});

const FormSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    fields: [FieldSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Form", FormSchema);
