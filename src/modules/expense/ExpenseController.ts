import { NextFunction, Request, Response } from 'express';
import ExpenseService from './ExpenseService';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';

class ExpenseController {
  private expenseService: ExpenseService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  createExpense = async (req: Request, res: Response, next: NextFunction) => {
    const {
      evidence,
      expenseCategoryId,
      note,
      price,
      date,
      userId,
    }: CreateExpenseDTO = req.body;

    console.log('body : ', req.body);

    try {
      const expense = await this.expenseService.createExpense({
        evidence,
        expenseCategoryId,
        note,
        price,
        date,
        userId,
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
      const expenseAmount =
        await this.expenseService.getExpenseAmountByCategory();

      return sendSuccessResponse(
        res,
        expenseAmount,
        'Expense Sales fetched successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  getAllExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('user : ', (req as any).user);

      const expenses = await this.expenseService.getAllExpenses();

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

  updateExpense = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { evidence, expenseCategoryId, note, price, date }: UpdateExpenseDTO =
      req.body;
    try {
      const expense = await this.expenseService.updateExpense(id, {
        evidence,
        expenseCategoryId,
        note,
        price,
        date,
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
