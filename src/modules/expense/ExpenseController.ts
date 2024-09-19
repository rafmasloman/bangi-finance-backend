import { NextFunction, Request, Response } from 'express';
import ExpenseService from './ExpenseService';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';

class ExpenseController {
  private expenseService: ExpenseService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
    this.createExpense = this.createExpense.bind(this);
    this.getAllExpenses = this.getAllExpenses.bind(this);
    this.getDetailExpense = this.getDetailExpense.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  async createExpense(req: Request, res: Response, next: NextFunction) {
    const { evidence, expenseCategoryId, note, price }: CreateExpenseDTO =
      req.body;
    try {
      const expense = await this.expenseService.createExpense({
        evidence,
        expenseCategoryId,
        note,
        price,
      });

      return res.json({
        statusCode: 201,
        message: 'Expense Created',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const expenses = await this.expenseService.getAllExpenses();

      return res.json({
        statusCode: 200,
        message: 'Success Get All Expenses Data',
        data: expenses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDetailExpense(req: Request, res: Response, next: NextFunction) {
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
  }

  async updateExpense(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { evidence, expenseCategoryId, note, price }: UpdateExpenseDTO =
      req.body;
    try {
      const expense = await this.expenseService.updateExpense(id, {
        evidence,
        expenseCategoryId,
        note,
        price,
      });

      return res.json({
        statusCode: 201,
        message: 'Expense Updated',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(req: Request, res: Response, next: NextFunction) {
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
  }
}

export default ExpenseController;
