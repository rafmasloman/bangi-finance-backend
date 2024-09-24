import { NextFunction, Request, Response } from 'express';
import ExpenseCategoryService from './ExpenseCategoryService';
import {
  CreateExpenseCategoryDTO,
  UpdateExpenseCategoryDTO,
} from '../../dto/ExpenseDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';

class ExpenseCategoryController {
  private expenseCat: ExpenseCategoryService;

  constructor(expenseCat: ExpenseCategoryService) {
    this.expenseCat = expenseCat;
  }

  createExpenseCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { name }: CreateExpenseCategoryDTO = req.body;
    try {
      const expenseCategory = await this.expenseCat.createExpenseCategory({
        name,
      });

      return res.json({
        statusCode: 201,
        message: 'Expense Category Created',
        data: expenseCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllExpenseCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const expenseCategories = await this.expenseCat.getAllExpenseCategory();

      return res.json({
        statusCode: 200,
        message: 'Expense Categories success to show',
        data: expenseCategories,
      });
    } catch (error) {
      next(error);
    }
  };

  updateExpenseCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const { name }: UpdateExpenseCategoryDTO = req.body;
    const expenseCatId = Number(id);
    try {
      const expenseCategory = await this.expenseCat.updateExpenseCategory(
        expenseCatId,
        { name },
      );

      return res.json({
        statusCode: 201,
        message: 'Expense Category Updated',
        data: expenseCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteExpenseCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const expenseCategory = await this.expenseCat.deleteExpenseCategory(
        Number(id),
      );

      return sendSuccessResponse(
        res,
        null,
        'Expense Category deleted succesfully',
      );
    } catch (error) {
      next(error);
    }
  };
}

export default ExpenseCategoryController;
