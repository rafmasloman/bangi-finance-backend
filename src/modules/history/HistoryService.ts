import { ExpenseCategories } from '@prisma/client';
import { CreateHistoryDTO, UpdateHistoryDTO } from '../../dto/HistoryDTO';
import prisma from '../../libs/prisma/orm.libs';
import ExpenseService from '../expense/ExpenseService';
import { getPaymentStatusTotalUtils } from '../../utils/supplier.utils';

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
      const historiesUser = await prisma.history.findMany({
        where: {
          userId,
        },
      });

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

      const totalPaidSupplier = await getPaymentStatusTotalUtils(historyId);

      const totalSalesExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SALES',
          historyId,
        },
        _sum: {
          price: true,
        },
      });

      const totalTaxExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'PPN',
          historyId,
        },
        _sum: {
          price: true,
        },
      });

      const totalManagementServiceExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SERVICE_MANAJEMEN',
          historyId,
        },
        _sum: {
          price: true,
        },
      });

      const totalEmployeeServiceExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'SERVICE_KARYAWAN',
          historyId,
        },
        _sum: {
          price: true,
        },
      });

      const totalEmployeePayrollExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'GAJI_KARYAWAN',
          historyId,
        },
        _sum: {
          price: true,
        },
      });

      const totalOperationalExpense = await prisma.expense.aggregate({
        where: {
          expenseCategory: 'OPERASIONAL',
          historyId,
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

      if (!history) {
        throw new Error('History Not Found');
      }

      const mdr = await this.getMDRHistory(historyId);

      const taxExpenseSum = !totalTaxExpense._sum.price
        ? 0
        : totalTaxExpense._sum.price;

      const payrollExpenseSum = !totalEmployeePayrollExpense._sum.price
        ? 0
        : totalEmployeePayrollExpense._sum.price;

      const operationalExpenseSum = !totalOperationalExpense._sum.price
        ? 0
        : totalOperationalExpense._sum.price;

      const serviceEmployeeExpenseSum = !totalEmployeeServiceExpense._sum.price
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
        history.remainingManagementService;

      let remainingMontEmployeeService =
        (income._sum.service ?? 0) * 0.6 -
        serviceEmployeeExpenseSum +
        history.remainingEmployeeService;

      let remainingSales =
        (income._sum.totalSales ?? 0) -
        (totalSalesExpense._sum.price ?? 0) -
        totalPaidSupplier.totalPaid -
        payrollExpenseSum -
        operationalExpenseSum;

      const balance =
        remainingSales +
        remainingMontEmployeeService +
        remainingMonthManagementService +
        remainingMonthTax;

      return {
        remainingMontEmployeeService: Math.round(
          remainingMontEmployeeService,
        ).toFixed(3),
        remainingMonthManagementService: Math.round(
          remainingMonthManagementService,
        ).toFixed(3),
        remainingMonthTax,
        remainingSales,
        balance: Math.round(balance),
      };
    } catch (error) {
      throw error;
    }
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
          mdr: mdr?.mdr ?? 0,
          totalMDR: 0,
        };
      }

      const totalMDR = !totalCollection[0]._sum.totalCollection
        ? 0
        : (mdr.mdr * totalCollection[0]._sum.totalCollection) / 100;

      return {
        mdr: mdr.mdr.toFixed(3),
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
