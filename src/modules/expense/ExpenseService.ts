import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';
import prisma from '../../libs/prisma/orm.libs';
import expenseUtils from '../../utils/ExpenseUtils';

class ExpenseService {
  async createExpense(payload: CreateExpenseDTO) {
    const { evidence, expenseCategoryId, note, price, date, userId } = payload;

    try {
      const expense = prisma.expense.create({
        data: {
          evidence,
          price,
          date,
          expenseCategoryId,
          note,
          userId,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getAllExpenses() {
    try {
      const expense = await prisma.expense.findMany({
        orderBy: {
          date: 'asc',
        },
        include: {
          expenseCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseAmountByCategory() {
    try {
      const expenseSales = await expenseUtils.calculateTotalByCategory('Sales');
      const serviceEmployee = await expenseUtils.calculateTotalByCategory(
        'Service Karyawan',
      );

      console.log('service');

      return {
        expenseSales,
        serviceEmployee,
      };
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
        include: {
          expenseCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async updateExpense(id: string, payload: UpdateExpenseDTO) {
    try {
      const { evidence, expenseCategoryId, note, price, date } = payload;
      const expense = await prisma.expense.update({
        where: {
          id,
        },
        data: {
          evidence,
          date,
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
      const expense = await prisma.expense.delete({
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
