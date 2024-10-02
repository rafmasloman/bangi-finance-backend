import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const checkAccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = (req as any).user;

    if (role === 'DIRECTOR') {
      next();
    }

    next();
  } catch (error) {
    console.log('auth middleware : ', error);

    next(error);
  }
};

export { checkAccess };
