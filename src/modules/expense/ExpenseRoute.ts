import { Router } from 'express';
import ExpenseController from './ExpenseController';
import { authMiddleware } from '../../middleware/auth.middleware';

class ExpenseRoute {
  private expenseController: ExpenseController;
  private route: Router;

  constructor(expenseController: ExpenseController) {
    this.expenseController = expenseController;
    this.route = Router();
    this.registerRoute();
  }

  private createExpenseRouter() {
    return this.route.post(
      '/',
      authMiddleware,
      this.expenseController.createExpense,
    );
  }

  private getAllExpensesRouter() {
    return this.route.get(
      '/',
      authMiddleware,
      this.expenseController.getAllExpenses,
    );
  }

  private getExpenseSales() {
    return this.route.get(
      '/:id/category-amount',
      authMiddleware,
      this.expenseController.getExpenseAmountByCategory,
    );
  }

  private getExpenseDetail() {
    return this.route.get(
      '/:id',
      authMiddleware,
      this.expenseController.getDetailExpense,
    );
  }

  private updateExpense() {
    return this.route.put(
      '/:id',
      authMiddleware,
      this.expenseController.updateExpense,
    );
  }

  private deleteExpense() {
    return this.route.delete(
      '/:id',
      authMiddleware,
      this.expenseController.deleteExpense,
    );
  }

  registerRoute() {
    this.createExpenseRouter();
    this.getAllExpensesRouter();
    this.getExpenseSales();
    this.getExpenseDetail();
    this.deleteExpense();
    this.updateExpense();

    return this.route;
  }

  getRouter() {
    return this.route;
  }
}

export default ExpenseRoute;
