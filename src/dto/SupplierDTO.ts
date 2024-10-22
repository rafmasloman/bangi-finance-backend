import { PaymentStatus } from '@prisma/client';

export interface CreateSupplierDTO {
  discount: number;
  evidence: string;
  paymentStatus: PaymentStatus;
  price: number;
  quantity: number;
  ppn: number;
  supplierCompanyId: number;
  historyId: string;
  date: Date;
  userId: string;
}

export interface UpdateSupplierDTO {
  discount?: number;
  evidence?: string;
  paymentStatus?: PaymentStatus;
  historyId?: string;
  price?: number;
  quantity?: number;
  ppn?: number;
  supplierCompanyId?: number;
  date?: Date;
  userId?: string;
}
