import { Router } from 'express';
import IncomeController from './IncomeController';
import { authMiddleware } from '../../middleware/auth.middleware';

class IncomeRoute {
  private incomeController: IncomeController;
  private router: Router;

  constructor(incomeController: IncomeController) {
    this.incomeController = incomeController;
    this.router = Router();
  }

  createIncomeRoute() {
    return this.router.post(
      '/',
      // authMiddleware,
      this.incomeController.createIncome,
    );
  }

  getAllIncomesRoute() {
    return this.router.get(
      '/',
      // authMiddleware,
      this.incomeController.getAllIncome,
    );
  }

  updateIncome() {
    return this.router.put(
      '/:id',
      // authMiddleware,
      this.incomeController.updateIncome,
    );
  }

  deleteIncome() {
    return this.router.delete(
      '/:id',
      // authMiddleware,
      this.incomeController.deleteIncome,
    );
  }

  getTotalIncomeAnalytics() {
    return this.router.get(
      '/analytics',
      // authMiddleware,
      this.incomeController.getTotalIncomeAnalytics,
    );
  }

  getIncomeDetail() {
    return this.router.get('/:id', this.incomeController.getIncomeDetail);
  }

  registerRoute() {
    this.createIncomeRoute();
    this.getAllIncomesRoute();
    this.updateIncome();
    this.deleteIncome();
    this.getTotalIncomeAnalytics();

    return this.router;
  }
}

export default IncomeRoute;
