import { CreateSupplierDTO, UpdateSupplierDTO } from '../../dto/SupplierDTO';
import prisma from '../../libs/prisma/orm.libs';

class SupplierService {
  async createSupplier(params: CreateSupplierDTO) {
    const {
      discount,
      evidence,
      paymentStatus,
      price,
      quantity,
      ppn,
      supplierCompanyId,
    } = params;
    try {
      const supplier = await prisma.supplier.create({
        data: {
          supplierCompany: {
            connect: {
              id: supplierCompanyId,
            },
          },
          discount,
          evidence,
          paymentStatus,
          price,
          quantity,
          ppn,
        },
      });

      return supplier;
    } catch (error) {
      throw error;
    }
  }

  async getAllSuppliers(page?: number, pageSize?: number) {
    try {
      if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
      }

      const skip = (page - 1) * pageSize;

      const supplier = await prisma.supplier.findMany({
        skip,
        take: pageSize,
      });

      const totalSupplier = await prisma.supplier.count();

      return { supplier, totalSupplier };
    } catch (error) {
      throw error;
    }
  }

  async getSupplierDetail(id: string) {
    try {
      const supplier = await prisma.supplier.findFirst({
        where: {
          id,
        },
      });

      return supplier;
    } catch (error) {
      throw error;
    }
  }

  async updateSupplier(id: string, params: UpdateSupplierDTO) {
    const {
      discount,
      evidence,
      paymentStatus,
      price,
      quantity,
      ppn,
      supplierCompanyId,
    } = params;
    try {
      const supplier = await prisma.supplier.update({
        where: {
          id,
        },
        data: {
          supplierCompany: {
            connect: {
              id: supplierCompanyId,
            },
          },
          discount,
          evidence,
          paymentStatus,
          price,
          quantity,
          ppn,
        },
      });

      return supplier;
    } catch (error) {
      throw error;
    }
  }

  async deleteSupplier(id: string) {
    try {
      const supplier = await prisma.supplier.delete({
        where: {
          id,
        },
      });

      return supplier;
    } catch (error) {
      throw error;
    }
  }
}

export default SupplierService;
