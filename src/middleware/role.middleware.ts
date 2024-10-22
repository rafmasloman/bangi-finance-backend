import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../helpers/response.helper';

const checkAccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = (req as any).user;

    if (role !== 'DIRECTOR') {
      return sendErrorResponse(res, null, 'Access Denied', 403);
    }

    next();
  } catch (error) {
    console.log('auth middleware : ', error);

    next(error);
  }
};

export { checkAccess };
