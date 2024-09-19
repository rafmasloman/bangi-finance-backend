import { Router } from 'express';
import ExpenseCategoryController from './ExpenseCategoryController';
import { authMiddleware } from '../../middleware/auth.middleware';

class ExpenseCategoryRoute {
  private expenseCatController: ExpenseCategoryController;
  private router: Router;

  constructor(expenseCatController: ExpenseCategoryController, route: Router) {
    this.expenseCatController = expenseCatController;
    this.router = route;
    this.registerRoute();
  }

  private createExpenseCatRoute() {
    return this.router.post(
      '/',
      authMiddleware,
      this.expenseCatController.createExpenseCategory,
    );
  }

  private getAllExpenseCatRoute() {
    return this.router.get(
      '/',
      authMiddleware,
      this.expenseCatController.getAllExpenseCategories,
    );
  }

  private updateExpenseCatRoute() {
    return this.router.put(
      '/:id',
      authMiddleware,
      this.expenseCatController.updateExpenseCategory,
    );
  }

  registerRoute() {
    this.createExpenseCatRoute();
    this.getAllExpenseCatRoute();
    this.updateExpenseCatRoute();

    return this.router;
  }

  getRoutes() {
    return this.router;
  }
}

export default ExpenseCategoryRoute;
