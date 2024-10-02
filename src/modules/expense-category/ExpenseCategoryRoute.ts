import { Router } from 'express';
import ExpenseCategoryController from './ExpenseCategoryController';
import { authMiddleware } from '../../middleware/auth.middleware';

class ExpenseCategoryRoute {
  private expenseCatController: ExpenseCategoryController;
  private router: Router;

  constructor(expenseCatController: ExpenseCategoryController) {
    this.expenseCatController = expenseCatController;

    this.router = Router();

    this.registerRoute();
  }

  private createExpenseCatRoute() {
    return this.router.post(
      '/',
      // authMiddleware,
      this.expenseCatController.createExpenseCategory,
    );
  }

  private getAllExpenseCatRoute() {
    return this.router.get(
      '/',
      // authMiddleware,
      this.expenseCatController.getAllExpenseCategories,
    );
  }

  private getExpenseCatDetailRoute() {
    return this.router.get(
      '/:id',
      // authMiddleware,
      this.expenseCatController.getExpenseCategoryDetail,
    );
  }

  private updateExpenseCatRoute() {
    return this.router.put(
      '/:id',
      // authMiddleware,
      this.expenseCatController.updateExpenseCategory,
    );
  }

  private deleteExpenseCatRoute() {
    return this.router.delete(
      '/:id',
      this.expenseCatController.deleteExpenseCategory,
    );
  }

  registerRoute() {
    this.createExpenseCatRoute();
    this.getAllExpenseCatRoute();
    this.getExpenseCatDetailRoute();
    this.updateExpenseCatRoute();
    this.deleteExpenseCatRoute();

    return this.router;
  }

  getRoutes() {
    return this.router;
  }
}

export default ExpenseCategoryRoute;
