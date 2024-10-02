import { PaymentStatus } from '@prisma/client';

export interface CreateSupplierDTO {
  discount: number;
  evidence: string;
  paymentStatus: PaymentStatus;
  price: number;
  quantity: number;
  ppn: number;
  supplierCompanyId: number;
  date: Date;
  userId: string;
}

export interface UpdateSupplierDTO {
  discount?: number;
  evidence?: string;
  paymentStatus?: PaymentStatus;
  price?: number;
  quantity?: number;
  ppn?: number;
  supplierCompanyId?: number;
  date?: Date;
  userId?: string;
}
