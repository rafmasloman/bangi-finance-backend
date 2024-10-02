import {
  CreateExpenseCategoryDTO,
  UpdateExpenseCategoryDTO,
} from '../../dto/ExpenseDTO';
import prisma from '../../libs/prisma/orm.libs';

class ExpenseCategoryService {
  async createExpenseCategory(payload: CreateExpenseCategoryDTO) {
    try {
      const { name } = payload;

      const expense = await prisma.expenseCategory.create({
        data: {
          name,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getAllExpenseCategory() {
    try {
      const expenseCategory = await prisma.expenseCategory.findMany({
        include: {
          expense: {
            select: {
              createdAt: true,
            },
          },
        },
      });

      return expenseCategory;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseCategoryDetail(id: string) {
    try {
      const expenses = await prisma.expenseCategory.findFirst({
        where: {
          id: Number(id),
        },
      });

      return expenses;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseCategoryTotalPrice(categoryId: number) {
    try {
      const expense = await prisma.expenseCategory.findMany({
        where: {
          id: categoryId,
        },
        select: {
          expense: {
            select: {
              price: true,
            },
          },
        },
      });
      const prices = expense.flatMap((category) =>
        category.expense.map((e) => e.price),
      );

      const totalPrice = prices.reduce((ctx, price) => ctx + price, 0);

      return totalPrice;
    } catch (error) {
      throw error;
    }
  }

  async updateExpenseCategory(id: number, payload: UpdateExpenseCategoryDTO) {
    const { name } = payload;
    try {
      const expenseCategory = await prisma.expenseCategory.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return expenseCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteExpenseCategory(id: number) {
    try {
      const expenseCategory = await prisma.expenseCategory.delete({
        where: {
          id,
        },
      });

      return expenseCategory;
    } catch (error) {
      throw error;
    }
  }
}

export default ExpenseCategoryService;
