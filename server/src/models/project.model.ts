import mongoose, { Schema, Types } from 'mongoose';

interface IProject {
  name: string;
  userId: Types.ObjectId;
  description?: string;
  createdAt: number;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
