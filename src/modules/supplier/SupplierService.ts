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
      date,
    } = params;

    try {
      const totalAmount = quantity * price + ppn;
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
          totalAmount,
          date,
        },
        include: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return supplier;
    } catch (error) {
      console.log('errors : ', error);

      throw error;
    }
  }

  async getAllSuppliers(page?: number, pageSize?: number) {
    try {
      // if (!page || !pageSize) {
      //   page = 1;
      //   pageSize = 10;
      // }

      // const skip = (page - 1) * pageSize;

      const supplier = await prisma.supplier.findMany({
        // skip,
        // take: pageSize,
        include: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
        },
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
        include: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return supplier;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentStatusTotal() {
    try {
      const totalPaymentByStatus = await prisma.supplier.groupBy({
        by: ['paymentStatus'],
        where: {
          paymentStatus: {
            in: ['PAID', 'UNPAID'],
          },
        },
        _sum: {
          price: true,
        },
      });

      // const totalPaid = await prisma.supplier.findMany({
      //   where: {
      //     paymentStatus: 'PAID',
      //   },
      // });

      // const countTotalPaid = totalPaymentByStatus.reduce(
      //   (acc, item) => (!item._sum.price ? 0 : acc + item._sum.price),
      //   0,
      // );

      const totalPaid = totalPaymentByStatus.find(
        (status) => status.paymentStatus === 'PAID',
      );

      return {
        paymentStatusAmount: totalPaymentByStatus,
        totalPaid: totalPaid?._sum.price,
      };
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
      date,
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
          date,
        },
        include: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
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
