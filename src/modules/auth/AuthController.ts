import { NextFunction, Request, Response } from 'express';
import AuthService from './AuthService';
import { LoginDTO } from '../../dto/AuthDTO';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: LoginDTO = req.body;
      const user = await this.authService.login({ email, password });

      (req as any).user = user;
      res.cookie('token', user);

      return res.json({
        statusCode: 201,
        message: 'User succesful login',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
