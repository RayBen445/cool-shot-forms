import mongoose, { Schema, Document } from "mongoose";

export interface IResponse extends Document {
  formId: string;
  answers: Record<string, any>;
  submittedAt: Date;
}

const ResponseSchema = new Schema<IResponse>(
  {
    formId: { type: String, required: true },
    answers: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: { createdAt: "submittedAt", updatedAt: false },
  }
);

export default mongoose.models.Response ||
  mongoose.model<IResponse>("Response", ResponseSchema);
