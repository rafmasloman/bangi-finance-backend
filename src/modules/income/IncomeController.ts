import { NextFunction, Request, Response } from 'express';
import IncomeService from './IncomeService';
import { CreateIncomeDTO } from '../../dto/IncomeDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';
import {
  DELETE_INCOMES_MESSAGE,
  READ_INCOMES_MESSAGE,
} from '../../contants/message_response';

class IncomeController {
  private incomeService: IncomeService;

  constructor(incomeService: IncomeService) {
    this.incomeService = incomeService;
    this.createIncome = this.createIncome.bind(this);
  }

  async createIncome(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
      }: CreateIncomeDTO = req.body;

      const income = await this.incomeService.createIncome({
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
      });

      return sendSuccessResponse(res, income, READ_INCOMES_MESSAGE, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllIncome(req: Request, res: Response, next: NextFunction) {
    try {
      const incomes = await this.incomeService.getAllIncomes();

      return sendSuccessResponse(res, incomes, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateIncome(req: Request, res: Response, next: NextFunction) {
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
      }: CreateIncomeDTO = req.body;

      const income = await this.incomeService.updateIncome(id, {
        date,
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
      });

      return sendSuccessResponse(res, income, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteIncome(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const income = await this.incomeService.deleteIncome(id);

      return sendSuccessResponse(res, income, DELETE_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  }

  async getTotalIncomeAnalytics(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const incomes = await this.incomeService.getIncomesDataAnalytics();

      return sendSuccessResponse(res, incomes, READ_INCOMES_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default IncomeController;
