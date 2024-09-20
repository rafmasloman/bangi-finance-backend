import { CreateIncomeDTO, UpdateIncomeDTO } from '../../dto/IncomeDTO';
import prisma from '../../libs/prisma/orm.libs';

class IncomeService {
  async createIncome(payload: CreateIncomeDTO) {
    try {
      let {
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
        date,
      } = payload;

      let totalSales = 0;

      if (!focItem || !itemDiscount || !billDiscount) {
        focItem = 0;
        itemDiscount = 0;
        billDiscount = 0;

        totalSales +=
          itemSales - focBill - focItem - itemDiscount - billDiscount;
      }

      totalSales += itemSales - focBill - focItem - itemDiscount - billDiscount;

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
      const incomes = await prisma.income.findMany();

      return incomes;
    } catch (error) {
      throw error;
    }
  }

  async updateIncome(id: string, payload: CreateIncomeDTO) {
    try {
      let {
        focBill,
        itemSales,
        service,
        billDiscount,
        focItem,
        itemDiscount,
        date,
      } = payload;

      let totalSales = 0;

      if (!focItem || !itemDiscount || !billDiscount) {
        focItem = 0;
        itemDiscount = 0;
        billDiscount = 0;

        totalSales +=
          itemSales - focBill - focItem - itemDiscount - billDiscount;
      }

      totalSales += itemSales - focBill - focItem - itemDiscount - billDiscount;

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

  async getIncomesDataAnalytics() {
    try {
      const incomes = await prisma.income.findMany();

      const collectTotalSales = incomes.map((tSales) => tSales.totalSales);
      const collectServices = incomes.map((service) => service.service);
      const collectTotalCollection = incomes.map(
        (collection) => collection.totalCollection,
      );

      const totalSalesCount = collectTotalSales.reduce(
        (acc, currentValue) => acc + currentValue,
        0,
      );

      const ppnCount = (totalSalesCount * 10) / 100;

      return {
        totalSalesCount,
        ppnCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default IncomeService;
