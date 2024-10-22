import { Router } from 'express';
import UserController from './UserController';
import { authMiddleware } from '../../middleware/auth.middleware';
import { checkAccess } from '../../middleware/role.middleware';

class UserRoute {
  userController: UserController;
  router: Router;

  constructor(userController: UserController) {
    this.userController = userController;
    this.router = Router();
    this.registerRoute();
  }

  private getAllUsersRoute() {
    return this.router.get(
      '/',
      authMiddleware,
      checkAccess,
      this.userController.getAllUsers,
    );
  }

  private getUserDetail() {
    return this.router.get(
      '/:id',
      authMiddleware,
      this.userController.getDetailUser,
    );
  }

  private createUserRoute() {
    return this.router.post(
      '/',
      authMiddleware,
      this.userController.createUser,
    );
  }

  private deleteUserRoute() {
    return this.router.delete(
      '/:id',
      authMiddleware,
      this.userController.deleteUser,
    );
  }

  private registerRoute() {
    this.getAllUsersRoute();
    this.createUserRoute();
    this.deleteUserRoute();
    this.getUserDetail();

    return this.router;
  }

  getRoute() {
    return this.router;
  }
}

export default UserRoute;
