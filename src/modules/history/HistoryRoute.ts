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

  updateHistory() {
    return this.router.put(
      '/:id',
      authMiddleware,
      this.historyController.updateHistory,
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
    this.updateHistory();
    this.deleteHistory();

    return this.router;
  }
}

export default HistoryRoute;
