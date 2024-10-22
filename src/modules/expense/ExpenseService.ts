import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';
import { paginationHelper } from '../../helpers/pagination.helper';
import prisma from '../../libs/prisma/orm.libs';
import expenseUtils from '../../utils/ExpenseUtils';

class ExpenseService {
  async createExpense(payload: CreateExpenseDTO) {
    const {
      evidence,
      expenseCategoryId,
      note,
      price,
      date,
      userId,
      historyId,
    } = payload;

    try {
      const findExpense = await prisma.expenseCategory.findUnique({
        where: {
          id: expenseCategoryId,
        },
      });

      console.log('find expense : ', findExpense);

      const expense = prisma.expense.create({
        data: {
          evidence,
          price,
          date,
          expenseCategoryId,
          note,
          historyId,
          userId,
        },
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getAllExpenses(
    historyId: string,
    userId: string,
    page?: number,
    pageSize?: number,
  ) {
    try {
      const totalRecords = await prisma.expense.count();

      const pagination = paginationHelper(page, pageSize, totalRecords);

      const expense = await prisma.expense.findMany({
        orderBy: {
          date: 'asc',
        },
        where: {
          historyId,
        },
        include: {
          expenseCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          histories: {
            select: {
              title: true,
            },
          },
        },
        skip: pagination.skip,
        take: pagination.take,
      });

      return { expense, totalPage: pagination.totalPage };
    } catch (error) {
      throw error;
    }
  }

  async getExpenseAmountByCategory(category: string[], historyId: string) {
    try {
      const totalCategories = await prisma.expense.groupBy({
        by: ['expenseCategoryId'],
        where: {
          expenseCategory: {
            name: {
              in: category,
            },
          },
          histories: {
            id: historyId,
          },
        },
        _sum: {
          price: true,
        },
      });

      const categoriesWithNames = await Promise.all(
        totalCategories.map(async (item: any) => {
          const categoryName = await prisma.expenseCategory.findUnique({
            where: { id: item.expenseCategoryId },
            select: { name: true },
          });

          return {
            ...item,

            expenseCategoryName: categoryName?.name,
          };
        }),
      );

      return categoriesWithNames;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseHistoryStats(historyId: string, expenseCategoryName: string) {
    try {
      const expense = await prisma.expense.findMany({
        where: {
          historyId,
          expenseCategory: {
            name: expenseCategoryName,
          },
        },
        select: {
          price: true,
        },
      });

      const managementServiceHistory = await prisma.history.findFirst({
        where: {
          id: historyId,
        },
      });
    } catch (error) {}
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
      const {
        evidence,
        expenseCategoryId,
        note,
        price,
        date,
        historyId,
        userId,
      } = payload;
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
          userId,
          historyId,
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
