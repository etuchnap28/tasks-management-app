import mongoose, { Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRoles } from '@shared/types/UserRoles';
import { Project } from './project.model';
import { Task } from './task.model';

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    refreshTokens?: Types.Array<string>;
    roles: {
        User: number;
        Admin?: number;
    };
    createdAt: number;
}

interface IUserMethods {
    comparePassword: (this: IUser, inputPwd: string) => Promise<boolean>;
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new Schema<IUser, IUserMethods, UserModel>(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshTokens: [String],
        roles: {
            type: {
                User: Number,
                Admin: Number,
            },
            default: {
                User: UserRoles.USER,
            },
            _id: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
});

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const projects = await Project.find({ userId: this._id });
    for (const project of projects) {
        await project.deleteOne();
    }
    const tasks = await Task.find({ userId: this._id });
    for (const task of tasks) {
        await task.deleteOne();
    }
    next();
});

userSchema.method('comparePassword', async function (this: IUser, inputPwd: string): Promise<boolean> {
    const match = bcrypt.compare(inputPwd, this.password);
    return await match;
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
