import { Router } from 'express';
import AuthController from './AuthController';

class AuthRoute {
  authController: AuthController;
  route: Router;

  constructor(authController: AuthController) {
    this.authController = authController;
    this.route = Router();
    this.registerRoute();
  }

  loginRoute() {
    console.log('route login initialize');

    return this.route.post('/login', this.authController.login);
  }

  registerRoute() {
    this.loginRoute();

    return this.route;
  }

  getRoute() {
    return this.route;
  }
}

export default AuthRoute;
