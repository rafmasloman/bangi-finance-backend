import { CreateSupplierDTO, UpdateSupplierDTO } from '../../dto/SupplierDTO';
import { paginationHelper } from '../../helpers/pagination.helper';
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
      historyId,
      userId,
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
      throw error;
    }
  }

  async getAllSuppliers(
    historyId: string,
    userId: string,
    page?: number,
    pageSize?: number,
    supplierCompanyId?: number
  ) {
    try {



      const totalSupplier = await prisma.supplier.count();

      const pagination = paginationHelper(page, pageSize, totalSupplier);


      const supplier = await prisma.supplier.findMany({
        where: {
          historyId,
          ...(supplierCompanyId ? { supplierCompanyId } : {}),
        },
        include: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: pagination.skip,
        take: pagination.take,
      });

      return { supplier, totalPage: pagination.totalPage };
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

  async getPaymentStatusTotal(historyId?: string) {
    try {
      const totalPaymentByStatus = await prisma.supplier.groupBy({
        by: ['paymentStatus'],
        where: {
          paymentStatus: {
            in: ['PAID', 'UNPAID'],
          },
          histories: {
            id: historyId,
          },
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          _all: true,
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
      const totalUnpaid = totalPaymentByStatus.find(
        (status) => status.paymentStatus === 'UNPAID',
      );

      return {
        paymentStatusAmount: totalPaymentByStatus,
        totalPaid: totalPaid?._sum.totalAmount ?? 0,
        totalUnpaid: totalUnpaid?._sum.totalAmount ?? 0,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentTotalBySupplier(
    historyId: string,
    paymentStatus: 'PAID' | 'UNPAID',
  ) {
    try {
      const suppliers = await prisma.supplier.findMany({
        where: {
          historyId,
          paymentStatus: paymentStatus,
        },
        select: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
          totalAmount: true,
        },
      });

      const totalPayment = await prisma.supplier.aggregate({
        where: {
          historyId,
          paymentStatus,
        },
        _sum: {
          totalAmount: true,
        },
      });

      const results = suppliers.reduce((acc: any, supplier: any) => {
        const companyId = supplier.supplierCompany.id;

        // Jika supplierCompany belum ada di akumulator, buat entry baru
        if (!acc[companyId]) {
          acc[companyId] = {
            id: supplier.supplierCompany.id,
            name: supplier.supplierCompany.name,
            totalAmount: 0,
          };
        }

        // Tambahkan totalAmount ke supplierCompany yang relevan
        acc[companyId].totalAmount += supplier.totalAmount;

        return acc;
      }, []);

      const payment = Object.values(results).filter(
        (item: any) => item.totalAmount > 0,
      );

      return {
        payment,
        totalPayment: totalPayment._sum.totalAmount ?? 0,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateSupplier(id: string, params: CreateSupplierDTO) {
    const {
      discount,
      evidence,
      paymentStatus,
      price,
      quantity,
      ppn,
      supplierCompanyId,
      date,
      historyId,
      userId,
    } = params;
    try {
      const totalAmount = quantity * price + ppn;

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
          discount,
          evidence,
          paymentStatus,
          price,
          quantity,
          ppn,
          date,
          totalAmount,
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

  async updateSupplierStatus(id: string[], paymentStatus: 'PAID' | 'UNPAID') {
    try {
      const supplier = await prisma.supplier.updateMany({
        where: {
          id: {
            in: id,
          },
        },
        data: {
          paymentStatus,
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
