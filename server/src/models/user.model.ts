import mongoose, { Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  refreshTokens?: Types.Array<string>;
  roles: {
    User: number;
    Editor?: number;
    Admin?: number;
  };
  createdAt: number;
}

interface IUserMethods {
  fullName: (this: IUser) => string;
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
        Editor: Number,
        Admin: Number,
      },
      default: {
        User: 2001,
      },
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

userSchema.method('fullName', function fullName(this: IUser): string {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.method('comparePassword', async function (this: IUser, inputPwd: string): Promise<boolean> {
  const match = bcrypt.compare(inputPwd, this.password);
  return await match;
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
