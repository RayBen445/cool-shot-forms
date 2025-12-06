import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  id: string;
  type: "text" | "email" | "number" | "textarea" | "checkbox" | "radio" | "select";
  label: string;
  required?: boolean;
  options?: string[]; // For radio, checkbox, and select
}

export interface IForm extends Document {
  title: string;
  questions: IQuestion[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
});

const FormSchema = new Schema<IForm>(
  {
    title: { type: String, required: true, default: "Untitled Form" },
    questions: [QuestionSchema],
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);
