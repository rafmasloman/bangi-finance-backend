import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';
import prisma from '../../libs/prisma/orm.libs';

class ExpenseService {
  async createExpense(payload: CreateExpenseDTO) {
    const { evidence, expenseCategoryId, note, price } = payload;

    try {
      const expense = prisma.expense.create({
        data: {
          evidence,
          price,
          expenseCategoryId,
          note,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getAllExpenses() {
    try {
      const expense = await prisma.expense.findMany();

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseDetail(id: string) {
    try {
      const expense = await prisma.expense.findFirst({
        where: {
          id,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async updateExpense(id: string, payload: UpdateExpenseDTO) {
    try {
      const { evidence, expenseCategoryId, note, price } = payload;
      const expense = await prisma.expense.update({
        where: {
          id,
        },
        data: {
          evidence,
          price,
          expenseCategoryId,
          note,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async deleteExpense(id: string) {
    try {
      const expense = await prisma.expense.findFirst({
        where: {
          id,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }
}

export default ExpenseService;
