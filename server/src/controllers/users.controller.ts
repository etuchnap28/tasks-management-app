import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { User } from '@models/user.model';

export const readUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await User.find();
  res.json(result);
});

export const readUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await User.findById(req.params.userId);
  res.json(result);
});
