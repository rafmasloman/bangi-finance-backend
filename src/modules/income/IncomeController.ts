import { NextFunction, Request, Response } from 'express';
import IncomeService from './IncomeService';
import { CreateIncomeDTO } from '../../dto/IncomeDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';
import {
  DELETE_INCOMES_MESSAGE,
  READ_INCOMES_MESSAGE,
  READ_INCOMES_SUMMARY_MESSAGE,
} from '../../contants/message_response';
import { BaseRequestType } from '../../middleware/auth.middleware';

class IncomeController {
  private incomeService: IncomeService;

  constructor(incomeService: IncomeService) {
    this.incomeService = incomeService;
    // this.createIncome = this.createIncome.bind(this);
    // this.getAllIncome = this.getAllIncome.bind(this);
    // this.updateIncome = this.updateIncome.bind(this);
    // this.deleteIncome = this.deleteIncome.bind(this);
    // this.getTotalIncomeAnalytics = this.getTotalIncomeAnalytics.bind(this);
  }

  createIncome = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
        userId,
        historyId,
      }: CreateIncomeDTO = req.body;

      const income = await this.incomeService.createIncome({
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
        userId,
        historyId,
      });

      return sendSuccessResponse(res, income, READ_INCOMES_MESSAGE, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllIncome = async (
    req: BaseRequestType,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User not found');
      }

      const { historyId, page, pageSize } = req.query as {
        historyId: string;
        page?: string;
        pageSize?: string;
      };

      const incomes = await this.incomeService.getAllIncomes(
        historyId,
        userId,
        Number(page),
        Number(pageSize),
      );

      return sendSuccessResponse(res, incomes, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };

  getIncomeDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const incomes = await this.incomeService.getIncomeDetail(id);

      return sendSuccessResponse(res, incomes, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };

  getIncomeSummaryData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const incomeSummary = await this.incomeService.getIncomeSummaryData(id);

      return sendSuccessResponse(
        res,
        incomeSummary,
        READ_INCOMES_SUMMARY_MESSAGE,
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  getIncomeProfitSummary = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const profit = await this.incomeService.getIncomeProfitSummary(id);

      return sendSuccessResponse(
        res,
        profit,
        READ_INCOMES_SUMMARY_MESSAGE,
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  updateIncome = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
        userId,
        historyId,
      }: CreateIncomeDTO = req.body;

      const income = await this.incomeService.updateIncome(id, {
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
        userId,
        historyId,
      });

      return sendSuccessResponse(res, income, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteIncome = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const income = await this.incomeService.deleteIncome(id);

      return sendSuccessResponse(res, income, DELETE_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };

  getTotalIncomeAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const incomes = await this.incomeService.getIncomesDataAnalytics(id);

      return sendSuccessResponse(res, incomes, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };
}

export default IncomeController;
