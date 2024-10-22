import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import HistoryController from './HistoryController';

class HistoryRoute {
  private historyController: HistoryController;
  private router: Router;

  constructor(historyController: HistoryController) {
    this.historyController = historyController;
    this.router = Router();
  }

  createHistoryRoute() {
    return this.router.post(
      '/',
      authMiddleware,
      this.historyController.createHistory,
    );
  }

  getAllHistorysRoute() {
    return this.router.get(
      '/',
      authMiddleware,
      this.historyController.getAllHistories,
    );
  }

  getDetailHistoryRoute() {
    return this.router.get(
      '/:id',
      authMiddleware,
      this.historyController.getDetailHistory,
    );
  }

  getExpenseServiceMasterDataStats() {
    return this.router.get(
      '/masters-expense/stats',
      authMiddleware,
      this.historyController.getHistoryExpenseMasterDataStats,
    );
  }

  getHistoryServiceDataStats() {
    return this.router.get(
      '/:id/stats',
      authMiddleware,
      this.historyController.getHistoryRemainingData,
    );
  }

  getHistoriesUser() {
    return this.router.get(
      '/users/master',
      authMiddleware,
      this.historyController.getAllHistoryByUser,
    );
  }

  getMDRHistory() {
    return this.router.get(
      '/:id/mdr',
      authMiddleware,
      this.historyController.getMDRHistory,
    );
  }

  updateHistory() {
    return this.router.put(
      '/:id',
      authMiddleware,
      this.historyController.updateHistory,
    );
  }

  updateMDR() {
    return this.router.put(
      '/:id/mdr',
      authMiddleware,
      this.historyController.updateMDR,
    );
  }

  deleteHistory() {
    return this.router.delete(
      '/:id',
      authMiddleware,
      this.historyController.deleteHistory,
    );
  }

  registerRoute() {
    this.createHistoryRoute();
    this.getAllHistorysRoute();
    this.getHistoriesUser();
    this.getDetailHistoryRoute();
    this.getExpenseServiceMasterDataStats();
    this.getHistoryServiceDataStats();
    this.getMDRHistory();
    this.updateHistory();
    this.updateMDR();
    this.deleteHistory();

    return this.router;
  }
}

export default HistoryRoute;
