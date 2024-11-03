import { NextFunction, Request, Response } from 'express';
import ExpenseService from './ExpenseService';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';
import { BaseRequestType } from '../../middleware/auth.middleware';

class ExpenseController {
  private expenseService: ExpenseService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  createExpense = async (req: Request, res: Response, next: NextFunction) => {
    const {
      evidence,
      expenseCategory,
      note,
      price,
      date,
      userId,
      historyId,
    }: CreateExpenseDTO = req.body;

    try {
      const expense = await this.expenseService.createExpense({
        evidence,
        expenseCategory,
        note,
        price,
        date,
        userId,
        historyId,
      });

      return res.json({
        statusCode: 201,
        message: 'Expense Created',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  };

  getExpenseAmountByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const expenseAmount =
        await this.expenseService.getExpenseAmountByCategory(id);

      return sendSuccessResponse(
        res,
        expenseAmount,
        'Expense Total by Category fetched successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  getAllExpenses = async (
    req: BaseRequestType,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User Not Found');
      }

      const { historyId, page, pageSize } = req.query as {
        historyId: string;
        page?: string;
        pageSize?: string;
      };

      const expenses = await this.expenseService.getAllExpenses(
        historyId,
        userId,
        Number(page),
        Number(pageSize),
      );

      console.log('expenses : ', expenses);

      return res.json({
        statusCode: 200,
        message: 'Success Get All Expenses Data',
        data: expenses,
      });
    } catch (error) {
      next(error);
    }
  };

  getDetailExpense = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const expense = await this.expenseService.getExpenseDetail(id);

      return res.json({
        statusCode: 200,
        message: 'Succes get expense detail',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  };

  getExpenseSummary = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const expenseSummary = await this.expenseService.getExpenseSummary(id);

      return sendSuccessResponse(
        res,
        expenseSummary,
        'Expense Summary fetched successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  getExpenseCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const expenseCategory = await this.expenseService.getExpenseCategory();

      return sendSuccessResponse(
        res,
        expenseCategory,
        'Expense Category fetch succesfully',
      );
    } catch (error) {
      next(error);
    }
  };

  updateExpense = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const {
      evidence,
      expenseCategory,
      note,
      price,
      date,
      historyId,
      userId,
    }: UpdateExpenseDTO = req.body;
    try {
      const expense = await this.expenseService.updateExpense(id, {
        evidence,
        expenseCategory,
        note,
        price,
        date,
        historyId,
        userId,
      });

      return res.json({
        statusCode: 201,
        message: 'Expense Updated',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const expense = await this.expenseService.deleteExpense(id);

      return res.json({
        statusCode: 200,
        message: 'Expense Deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ExpenseController;
