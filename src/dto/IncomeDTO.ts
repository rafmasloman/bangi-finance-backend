import { PaymentStatus } from '@prisma/client';

export interface CreateIncomeDTO {
  date: Date;
  itemSales: number;
  itemDiscount?: number;
  billDiscount?: number;
  focItem?: number;
  focBill: number;
  service: number;
  userId: string;
}

export interface UpdateIncomeDTO {
  date: Date;
  itemSales?: number;
  itemDiscount?: number;
  billDiscount?: number;
  focItem?: number;
  focBill?: number;
  service?: number;
  userId?: string;
}
