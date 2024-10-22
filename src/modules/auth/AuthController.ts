import { NextFunction, Request, Response } from 'express';
import AuthService from './AuthService';
import { LoginDTO } from '../../dto/AuthDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.login = this.login.bind(this);
    this.credential = this.credential.bind(this);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: LoginDTO = req.body;

      const user = await this.authService.login({ email, password });

      (req as any).user = user;

      return res.json({
        statusCode: 201,
        message: 'User succesful login',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async credential(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).user;
      const user = await this.authService.userCredential(id);

      const userCredential = {
        id: user?.id,
        firstname: user?.firstname,
        lastname: user?.lastname,
        role: user?.role,
      };

      return sendSuccessResponse(
        res,
        userCredential,
        'Credential fetched succesfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  changeUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const user = await this.authService.changePassword(id, newPassword);

      return sendSuccessResponse(
        res,
        user,
        'Password change succesfully updated',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
