import { CreateIncomeDTO, UpdateIncomeDTO } from '../../dto/IncomeDTO';
import { paginationHelper } from '../../helpers/pagination.helper';
import prisma from '../../libs/prisma/orm.libs';

class IncomeService {
  async createIncome(payload: CreateIncomeDTO) {
    try {
      let {
        focBill = 0,
        itemSales,
        service,
        billDiscount = 0,
        focItem = 0,
        itemDiscount = 0,
        date,
        historyId,
        userId,
      } = payload;

      const totalSales =
        itemSales - focBill - focItem - itemDiscount - billDiscount;

      const ppn = (totalSales * 10) / 100;
      const totalCollection = totalSales + ppn + service;

      const income = await prisma.income.create({
        data: {
          date,
          focBill,
          itemSales,
          service,
          billDiscount,
          focItem,
          itemDiscount,
          totalSales,
          ppn,
          totalCollection,
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

      return income;
    } catch (error) {
      throw error;
    }
  }

  async getAllIncomes(
    historyId: string,
    userId: string,
    page?: number,
    pageSize?: number,
  ) {
    try {
      const totalRecords = await prisma.income.count();

      const pagination = paginationHelper(page, pageSize, totalRecords);

      const incomes = await prisma.income.findMany({
        where: {
          historyId,
        },
        orderBy: {
          date: 'asc',
        },
        skip: pagination.skip,
        take: pagination.take,
      });

      return {
        incomes,
        totalPage: pagination.totalPage,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateIncome(id: string, payload: CreateIncomeDTO) {
    try {
      let {
        focBill = 0,
        itemSales,
        service,
        billDiscount = 0,
        focItem = 0,
        itemDiscount = 0,
        date,
        historyId,
        userId,
      } = payload;

      const totalSales =
        itemSales - focBill - focItem - itemDiscount - billDiscount;

      const ppn = (totalSales * 10) / 100;
      const totalCollection = totalSales + ppn + service;

      const income = await prisma.income.update({
        where: {
          id,
        },
        data: {
          date,
          focBill,
          itemSales,
          service,
          billDiscount,
          focItem,
          itemDiscount,
          totalSales,
          ppn,
          totalCollection,
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

      return income;
    } catch (error) {
      throw error;
    }
  }

  async deleteIncome(id: string) {
    try {
      const income = await prisma.income.delete({
        where: {
          id,
        },
      });

      return income;
    } catch (error) {
      throw error;
    }
  }

  async getIncomeDetail(id: string) {
    try {
      const income = await prisma.income.findFirst({
        where: {
          id,
        },
        include: {
          histories: {
            select: {
              id: true,
            },
          },
        },
      });

      return income;
    } catch (error) {
      throw error;
    }
  }

  async getIncomesDataAnalytics() {
    try {
      const incomes = await prisma.income.findMany();

      const collectTotalSales = incomes.map((tSales) => tSales.totalSales);
      const collectServices = incomes.map((service) => service.service);
      const collectTotalCollection = incomes.map(
        (collection) => collection.totalCollection,
      );

      const totalSalesAnalytics = collectTotalSales.reduce(
        (acc, currentValue) => acc + currentValue,
        0,
      );

      const totalServicesAnalytics = collectServices.reduce(
        (acc, currentValue) => acc + currentValue,
        0,
      );

      const totalCollectionAnalytics = collectTotalCollection.reduce(
        (acc, currentValue) => acc + currentValue,
        0,
      );

      const ppnAnalytics = totalSalesAnalytics * 0.1;

      const managementServiceAnalytics = totalServicesAnalytics * 0.4;
      const employeServiceAnalytics = totalServicesAnalytics * 0.6;

      const average =
        incomes.length <= 0 ? 0 : totalSalesAnalytics / incomes.length;

      return {
        salesAnalytics: {
          total: totalSalesAnalytics,
        },
        servicesAnalytics: {
          total: totalServicesAnalytics,
          category: {
            management: managementServiceAnalytics,
            employe: employeServiceAnalytics,
          },
        },
        collectionAnalytics: {
          total: totalCollectionAnalytics,
        },
        ppnAnalytics: {
          total: ppnAnalytics,
        },
        average,
      };
    } catch (error) {
      throw error;
    }
  }

  async getIncomeSummaryData(historyId?: string) {
    try {
      const totalBillDiscount = await prisma.income.aggregate({
        where: {
          historyId,
        },
        _sum: {
          billDiscount: true,
        },
      });

      const totalItemDiscount = await prisma.income.aggregate({
        where: {
          historyId,
        },
        _sum: {
          itemDiscount: true,
        },
      });

      const totalItemSales = await prisma.income.aggregate({
        where: {
          historyId,
        },
        _sum: {
          totalSales: true,
        },
      });

      const focBill = await prisma.income.aggregate({
        where: {
          historyId,
        },
        _sum: {
          focBill: true,
        },
      });

      const totalDiscount =
        (totalBillDiscount._sum.billDiscount ?? 0) +
        (totalItemDiscount._sum.itemDiscount ?? 0);
      const totalSales =
        (totalItemSales._sum.totalSales ?? 0) -
        totalDiscount -
        (focBill._sum.focBill ?? 0);

      const discByFoc =
        ((totalDiscount + (focBill._sum.focBill ?? 0)) /
          (totalItemSales._sum.totalSales ?? 0)) *
        100;

      return {
        itemSales: totalItemSales._sum.totalSales,
        totalDiscount,
        totalFoc: focBill._sum.focBill,
        totalSales,
        discByFoc: Math.round(discByFoc),
      };
    } catch (error) {
      throw error;
    }
  }
}

export default IncomeService;
