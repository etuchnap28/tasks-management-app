import mongoose, { Schema, Types } from 'mongoose';
import { Task } from './task.model';

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
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

projectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const tasksOfProject = await Task.find({ projectId: this._id });
    for (const task of tasksOfProject) {
        await task.deleteOne();
    }
    next();
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
