import { CreateIncomeDTO, UpdateIncomeDTO } from '../../dto/IncomeDTO';
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
        },
      });

      return income;
    } catch (error) {
      throw error;
    }
  }

  async getAllIncomes(page?: number, pageSize?: number) {
    try {
      const incomes = await prisma.income.findMany({
        orderBy: {
          date: 'asc',
        },
      });

      return incomes;
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

      console.log(totalSalesAnalytics);

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
}

export default IncomeService;
