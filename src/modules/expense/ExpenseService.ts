import { ExpenseCategories } from '@prisma/client';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../../dto/ExpenseDTO';
import { paginationHelper } from '../../helpers/pagination.helper';
import prisma from '../../libs/prisma/orm.libs';
import expenseUtils from '../../utils/ExpenseUtils';
import SupplierService from '../supplier/SupplierService';

class ExpenseService {
  supplierService: SupplierService;
  constructor(supplierService: SupplierService) {
    this.supplierService = supplierService;
  }

  async createExpense(payload: CreateExpenseDTO) {
    const { evidence, expenseCategory, note, price, date, userId, historyId } =
      payload;

    console.log('expense data : ', payload);

    try {
      const expense = prisma.expense.create({
        data: {
          evidence,
          note,
          price,
          date,
          expenseCategory,

          histories: {
            connect: {
              id: historyId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
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

      const user = await prisma.users.findFirst({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });

      const expense = await prisma.expense.findMany({
        orderBy: {
          date: 'asc',
        },
        where: {
          historyId,
          userId: user?.role === 'DIRECTOR' ? undefined : userId,
        },
        include: {
          histories: {
            select: {
              title: true,
            },
          },
          user: {
            select: {
              firstname: true,
              lastname: true,
              role: true,
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

  async getExpenseCategory() {
    try {
      const expenseCategories = Object.values(ExpenseCategories);

      return expenseCategories;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseAmountByCategory(historyId: string) {
    try {
      const totalCategories = await prisma.expense.groupBy({
        by: ['expenseCategory'],
        where: {
          expenseCategory: {
            in: [
              'GAJI_KARYAWAN',
              'OPERASIONAL',
              'PENGEMBALIAN_MODAL',
              'PPN',
              'SALES',
              'SERVICE_KARYAWAN',
              'SERVICE_MANAJEMEN',
            ],
          },
          histories: {
            id: historyId,
          },
        },
        _sum: {
          price: true,
        },
      });

      const totalExpenseByCategory = totalCategories.reduce(
        (acc, category) => acc + (category._sum.price ?? 0),
        0,
      );

      const totalPaidService = await this.supplierService.getPaymentStatusTotal(
        historyId,
      );

      const totalExpense =
        totalExpenseByCategory + (totalPaidService.totalPaid ?? 0);

      const response = totalCategories.map((expense) => {
        return {
          category: expense.expenseCategory,
          amount: expense._sum.price,
        };
      });

      return { expense: response, totalExpense };
    } catch (error) {
      throw error;
    }
  }

  async getExpenseHistoryStats(
    historyId: string,
    expenseCategoryName: ExpenseCategories,
  ) {
    try {
      const expense = await prisma.expense.findMany({
        where: {
          historyId,
          expenseCategory: expenseCategoryName,
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
      });

      return expense;
    } catch (error) {
      throw error;
    }
  }

  async getExpenseSummary(id?: string) {
    try {
      const ppnExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'PPN',
        },

        _sum: {
          price: true,
        },
      });

      const managementExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SERVICE_MANAJEMEN',
        },

        _sum: {
          price: true,
        },
      });

      const salesExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SALES',
        },

        _sum: {
          price: true,
        },
      });

      const totalPaidService = await this.supplierService.getPaymentStatusTotal(
        id,
      );

      const rawMaterials =
        (salesExpense._sum.price ?? 0) + (totalPaidService.totalPaid ?? 0);
      const operational = ppnExpense._sum.price ?? 0;
      const payrollEmployee = managementExpense._sum.price ?? 0;

      const totalExpense =
        rawMaterials + (operational ?? 0) + (payrollEmployee ?? 0);

      return {
        rawMaterials,
        operational,
        payrollEmployee,
        totalExpense,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateExpense(id: string, payload: UpdateExpenseDTO) {
    try {
      const { evidence, expenseCategory, note, price, date, historyId } =
        payload;

      const expense = await prisma.expense.update({
        where: {
          id,
        },
        data: {
          evidence,
          note,
          price,
          date,
          expenseCategory,
          histories: {
            connect: {
              id: historyId,
            },
          },
        },
      });

      return expense;
    } catch (error) {
      console.log('error : ', error);

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
