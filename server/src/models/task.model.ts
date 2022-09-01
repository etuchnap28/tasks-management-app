import mongoose, { Schema, Types } from 'mongoose';

interface ITask {
  name: string;
  userId: Types.ObjectId;
  projectId?: Types.ObjectId;
  description?: string;
  done: boolean;
  priority: number;
  createdAt: number;
  dueDate: Date;
}

const taskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    projectId: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    done: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Schema.Types.Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
