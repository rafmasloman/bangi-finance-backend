import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      //   throw new Error();
      console.log('error');
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY as string);

    req.signedCookies = decoded as any;
    console.log('decoded : ', req.signedCookies);

    next();
  } catch (error) {
    console.log('auth middleware : ', error);

    next(error);
  }
};

export { authMiddleware };
