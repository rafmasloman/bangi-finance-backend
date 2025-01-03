import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface BaseRequestType extends Request {
  user?: {
    id: string;
  };
}
const authMiddleware = (
  req: BaseRequestType,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      //   throw new Error();
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY as string);

    (req as any).user = decoded;

    req.signedCookies = decoded as any;

    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware };
