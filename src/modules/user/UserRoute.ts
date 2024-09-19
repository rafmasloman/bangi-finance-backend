import { Router } from 'express';
import UserController from './UserController';
import { authMiddleware } from '../../middleware/auth.middleware';

class UserRoute {
  userController: UserController;
  router: Router;

  constructor(userController: UserController, router: Router) {
    this.userController = userController;
    this.router = router;
    this.registerRoute();
  }

  private getAllUsersRoute() {
    return this.router.get(
      '/',
      authMiddleware,
      this.userController.getAllUsers,
    );
  }

  private registerRoute() {
    this.getAllUsersRoute();

    return this.router;
  }

  getRoute() {
    return this.router;
  }
}

export default UserRoute;
