import { config } from '@config/config';
import { User } from '@models/user.model';
import { logger } from '@shared/classes/Logger';
import { DecodedPayload } from '@shared/types';
import { Request, NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';
import { AuthorizationError, ConflictError } from '@shared/classes/exceptions';

interface RegisterRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    password: string;
  };
}

export const register = asyncHandler(
  async (req: ValidatedRequest<RegisterRequest>, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, password } = req.body;

    /* Check duplicated username (here is email) */
    const duplicatedUser = await User.findOne({ email }).exec();
    if (duplicatedUser != null) {
      next(new ConflictError('email'));
      return;
    }

    const result = await User.create({
      firstname,
      lastname,
      email,
      password,
    });
    logger.trace(result);

    res.status(201).json({ success: `New user ${email} created.` });
  }
);

export const login = asyncHandler(async (req: ValidatedRequest<LoginRequest>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  /* Check username */
  const foundUser = await User.findOne({ email });
  if (foundUser == null) {
    next(new AuthorizationError('email does not exist'));
    return;
  }

  /* Evaluate password */
  const isPwdValid = await foundUser.comparePassword(password);
  if (!isPwdValid) {
    next(new AuthorizationError('password is invalid'));
    return;
  }

  /* Create JWTs */
  const accessToken = jwt.sign(
    {
      user: foundUser._id.toString(),
    },
    config.jwt.accessTokenSecret,
    {
      expiresIn: '10m',
    }
  );
  const newRefreshToken = jwt.sign(
    {
      user: foundUser._id.toString(),
    },
    config.jwt.refreshTokenSecret,
    {
      expiresIn: '1h',
    }
  );

  const cookieJwt = req.cookies.jwt;

  /* When user didn't somehow log out and log in again,
    then there should be a token, which should be removed from cookies */
  if (cookieJwt !== '') {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    foundUser.refreshTokens = foundUser.refreshTokens?.pull(cookieJwt);
  }

  /* Saving newRefreshToken to user's refreshTokenArray */
  foundUser.refreshTokens?.push(newRefreshToken);
  const result = await foundUser.save();
  logger.trace(result);

  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 1000,
    secure: true,
  });
  res.json({ accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.jwt;
  if (refreshToken === '') {
    next(new AuthorizationError('no token found.'));
    return;
  }

  /* Clear the old jwt cookie */
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  /* Check if refresh token is illegal reused */
  const foundUser = await User.findOne({ refreshTokens: refreshToken });
  if (foundUser == null) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
      const user = (decoded as DecodedPayload).user;
      const hackedUser = await User.findById(user);
      if (hackedUser !== null) {
        hackedUser.refreshTokens = new Types.Array<string>();
        const result = await hackedUser.save();
        logger.trace(result);
      }
      next(new AuthorizationError('refresh token is reused'));
      return;
    } catch {
      next(new AuthorizationError('refresh token is reused'));
      return;
    }
  }

  foundUser.refreshTokens?.pull(refreshToken);
  /* Evaluate refresh token */
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
    const user = (decoded as DecodedPayload).user;

    if (foundUser._id.toString() !== user.toString()) {
      next(new AuthorizationError('refresh token is invalid'));
      return;
    }

    const accessToken = jwt.sign(
      {
        user,
      },
      config.jwt.accessTokenSecret,
      {
        expiresIn: '10m',
      }
    );
    const newRefreshToken = jwt.sign(
      {
        user,
      },
      config.jwt.refreshTokenSecret,
      {
        expiresIn: '1h',
      }
    );

    /* Saving refreshToken with current user */
    foundUser.refreshTokens?.push(newRefreshToken);
    const result = await foundUser.save();
    logger.trace(result);

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
      secure: true,
    });
    res.json({ accessToken });
  } catch {
    const result = await foundUser.save();
    logger.trace(result);
    next(new AuthorizationError('refresh token is expired'));
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.jwt;
  /* Check if there is token in cookies */
  if (refreshToken === '') {
    res.sendStatus(204);
    return;
  }

  /* Clear cookie */
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  /* Check if refresh token in DB */
  const foundUser = await User.findOne({ refreshTokens: refreshToken });
  if (foundUser == null) {
    res.sendStatus(204);
    return;
  }

  foundUser.refreshTokens?.pull(refreshToken);
  const result = await foundUser.save();
  logger.trace(result);

  res.sendStatus(204);
});
