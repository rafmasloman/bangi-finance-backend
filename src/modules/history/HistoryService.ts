import { ExpenseCategories } from '@prisma/client';
import { CreateHistoryDTO, UpdateHistoryDTO } from '../../dto/HistoryDTO';
import prisma from '../../libs/prisma/orm.libs';
import ExpenseService from '../expense/ExpenseService';

class HistoryService {
  async createHistory(payload: CreateHistoryDTO) {
    try {
      const historyTitle = `Buku ${payload.month} ${payload.year}`;
      const history = await prisma.history.create({
        data: {
          title: historyTitle,
          month: payload.month,
          remainingEmployeeService: payload.remainingEmployeeService,
          remainingManagementService: payload.remainingManagementService,
          remainingRawMaterials: payload.remainingRawMaterials,
          remainingTax: payload.remainingTax,
          remainingSales: 0,
          date: payload.date,
          year: payload.year,
          user: {
            connect: {
              id: payload.userId,
            },
          },
        },
      });

      return history;
    } catch (error) {
      console.log('create history error : ', error);

      throw error;
    }
  }

  async getAllHistories(month?: string, year?: string) {
    try {
      const history = await prisma.history.findMany({
        where: {
          ...(month && { month }),
          ...(year && { year }),
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async getAllHistoryByUserId(userId: string) {
    try {
      console.log('user id : ', userId);

      const historiesUser = await prisma.history.findMany({
        where: {
          userId,
        },
      });

      console.log('histories : ', historiesUser);

      return historiesUser;
    } catch (error) {
      throw error;
    }
  }

  async getDetailHistory(id: string) {
    try {
      const history = await prisma.history.findFirst({
        where: {
          id,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async getHistoryExpenseMasterDataStats(
    historyId: string,
    expenseName: ExpenseCategories,
  ) {
    try {
      const expenseServiceStats = await prisma.expense.findMany({
        where: {
          historyId,
          expenseCategory: expenseName,
        },
        select: {
          price: true,
        },
      });

      const expenseServiceManagement = expenseServiceStats.reduce(
        (acc, item) => {
          return acc + item.price;
        },
        0,
      );

      return {
        service: {
          managementExpense: expenseServiceManagement,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getHistoryServiceRemainingData(
    historyId: string,
    name: ExpenseCategories,
  ) {
    try {
      const remainingService = await this.getHistoryExpenseMasterDataStats(
        historyId,
        name,
      );

      const history = await prisma.history.findFirst({
        where: {
          id: historyId,
        },
        select: {
          remainingEmployeeService: true,
          remainingManagementService: true,
        },
      });

      if (!history || !name) {
        throw new Error('History Not Found');
      }

      const expenseService = await prisma.income.findMany({
        where: {
          historyId,
        },
        select: {
          service: true,
        },
      });

      const collectTotalService = expenseService.reduce((acc, item) => {
        return acc + item.service;
      }, 0);

      const managementServiceAnalytics = collectTotalService * 0.4;
      const employeServiceAnalytics = collectTotalService * 0.6;

      console.log('employee : ', employeServiceAnalytics);
      console.log('total tess : ', collectTotalService);
      console.log('remaning service data : ', remainingService.service);

      let remainingServiceData = 0;

      if (name.toLowerCase() === 'SERVICE MANAJEMEN'.toLowerCase()) {
        remainingServiceData =
          managementServiceAnalytics -
          (remainingService.service.managementExpense +
            (history?.remainingManagementService ?? 0));
      } else if (name.toLowerCase() === 'SERVICE KARYAWAN'.toLowerCase()) {
        remainingServiceData =
          employeServiceAnalytics -
          (remainingService.service.managementExpense +
            (history?.remainingEmployeeService ?? 0));
        console.log('total tess : ', remainingServiceData);
      }

      return {
        remainingServiceData,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHistoryRemainingData(historyId: string) {
    try {
      const income = await prisma.income.aggregate({
        where: {
          historyId,
        },
        _sum: {
          ppn: true,
          totalCollection: true,
          totalSales: true,
          service: true,
        },
      });

      const totalSalesExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SALES',
        },
        _sum: {
          price: true,
        },
      });

      const totalTaxExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'PPN',
        },
        _sum: {
          price: true,
        },
      });

      const totalManagementServiceExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SERVICE_MANAJEMEN',
        },
        _sum: {
          price: true,
        },
      });

      const totalEmployeeServiceExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SERVICE_KARYAWAN',
        },
        _sum: {
          price: true,
        },
      });

      const history = await prisma.history.findFirst({
        where: {
          id: historyId,
        },
        select: {
          remainingEmployeeService: true,
          remainingManagementService: true,
          remainingTax: true,
          mdr: true,
        },
      });

      console.log('history : ', historyId);

      if (!history) {
        throw new Error('History Not Found');
      }

      const mdr = await this.getMDRHistory(historyId);

      const taxExpenseSum = !totalTaxExpense._sum.price
        ? 0
        : totalTaxExpense._sum.price;

      const serviceEmployeExpenseSum = !totalEmployeeServiceExpense._sum.price
        ? 0
        : totalEmployeeServiceExpense._sum.price;

      const serviceManagementExpenseSum = !totalManagementServiceExpense._sum
        .price
        ? 0
        : totalManagementServiceExpense._sum.price;

      let remainingMonthTax =
        (income?._sum.ppn ?? 0) -
        taxExpenseSum +
        history?.remainingTax -
        mdr.totalMDR;

      let remainingMonthManagementService =
        (income._sum.service ?? 0) * 0.4 -
        serviceManagementExpenseSum +
        history.remainingEmployeeService;

      let remainingMontEmployeeService =
        (income._sum.service ?? 0) * 0.6 -
        serviceEmployeExpenseSum +
        history.remainingManagementService;

      let remainingSales =
        (income._sum.totalSales ?? 0) -
        (totalSalesExpense._sum.price ?? 0) -
        serviceEmployeExpenseSum -
        serviceManagementExpenseSum -
        taxExpenseSum;

      const balance =
        remainingSales +
        remainingMontEmployeeService +
        remainingMonthManagementService +
        remainingMonthTax;

      console.log('response : ', {
        remainingMontEmployeeService,
        remainingMonthManagementService,
        remainingMonthTax,
        remainingSales,
        balance: Math.round(balance),
      });

      return {
        remainingMontEmployeeService,
        remainingMonthManagementService,
        remainingMonthTax,
        remainingSales,
        balance: Math.round(balance),
      };
    } catch (error) {
      throw error;
    }
  }

  async getHistoryStatsAnalytics(expenseService: ExpenseService) {
    // const expense = await expenseService.getExpenseAmountByCategory();
    const history = await prisma.history.findFirst({
      where: {
        month: '',
      },
    });

    // const remainingManagementLastMonth =expense.serviceEmployee - history?.remainingManagementService
  }

  async getMDRHistory(id: string) {
    try {
      const totalCollection = await prisma.income.groupBy({
        by: ['historyId'],
        where: {
          historyId: id,
        },
        _sum: {
          totalCollection: true,
        },
      });

      const mdr = await prisma.history.findFirst({
        where: {
          id,
        },
        select: {
          mdr: true,
        },
      });

      if (!mdr?.mdr) {
        return {
          mdr: mdr?.mdr,
          totalMDR: 0,
        };
      }

      const totalMDR = !totalCollection[0]._sum.totalCollection
        ? 0
        : (mdr.mdr * totalCollection[0]._sum.totalCollection) / 100;

      return {
        mdr: mdr.mdr,
        totalMDR,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateHistory(id: string, payload: UpdateHistoryDTO) {
    try {
      const historyTitle = `Buku Bulan ${payload.month}`;

      const history = await prisma.history.update({
        where: {
          id,
        },
        data: {
          title: historyTitle,
          ...payload,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async updateMDR(id: string, payload: { mdr: number }) {
    try {
      const history = await prisma.history.update({
        where: {
          id,
        },
        data: {
          mdr: payload.mdr,
        },
      });

      return history;
    } catch (error) {
      console.log('error : ', error);

      throw error;
    }
  }

  async deleteHistory(id: string) {
    try {
      const history = await prisma.history.delete({
        where: {
          id,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }
}

export default HistoryService;
