import { Router } from 'express';
import AuthController from './AuthController';
import { authMiddleware } from '../../middleware/auth.middleware';

class AuthRoute {
  authController: AuthController;
  route: Router;

  constructor(authController: AuthController) {
    this.authController = authController;
    this.route = Router();
    this.registerRoute();
  }

  loginRoute() {
    return this.route.post('/login', this.authController.login);
  }

  credentialRoute() {
    return this.route.get(
      '/credential',
      authMiddleware,
      this.authController.credential,
    );
  }

  changePassword() {
    return this.route.put(
      '/change-password',
      authMiddleware,
      this.authController.changeUserPassword,
    );
  }

  registerRoute() {
    this.loginRoute();
    this.credentialRoute();
    this.changePassword();

    return this.route;
  }

  getRoute() {
    return this.route;
  }
}

export default AuthRoute;
