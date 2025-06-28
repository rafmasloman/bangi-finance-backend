import { PaymentStatus } from "@prisma/client";

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

export interface CreateSupplierDTOV2 {
  nomorFaktur: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  price: number;
  quantity: number;
  ppn: number;
  discount: number;
  evidence: string;
  supplierCompanyId: number;
  historyId: string;
  jatuhTempo: Date;
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
