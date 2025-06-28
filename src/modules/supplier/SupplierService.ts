import {
  CreateSupplierDTO,
  CreateSupplierDTOV2,
  UpdateSupplierDTO,
} from "../../dto/SupplierDTO";
import { paginationHelper } from "../../helpers/pagination.helper";
import prisma from "../../libs/prisma/orm.libs";

class SupplierService {
  // async createSupplier(params: CreateSupplierDTO) {
  //   const {
  //     discount,
  //     evidence,
  //     paymentStatus,
  //     price,
  //     quantity,
  //     ppn,
  //     supplierCompanyId,
  //     date,
  //     historyId,
  //     userId,
  //   } = params;

  //   try {
  //     const totalAmount = quantity * price + ppn;
  //     const supplier = await prisma.supplier.create({
  //       data: {
  //         supplierCompany: {
  //           connect: {
  //             id: supplierCompanyId,
  //           },
  //         },
  //         histories: {
  //           connect: {
  //             id: historyId,
  //           },
  //         },
  //         user: {
  //           connect: {
  //             id: userId,
  //           },
  //         },

  //         discount,
  //         evidence,
  //         paymentStatus,
  //         price,
  //         quantity,
  //         ppn,
  //         totalAmount,
  //         date,
  //       },
  //       include: {
  //         supplierCompany: {
  //           select: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //       },
  //     });

  //     return supplier;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async createSupplier(params: CreateSupplierDTOV2) {
    const {
      nomorFaktur,
      paymentStatus,
      supplierCompanyId,
      date,
      totalAmount,
      jatuhTempo,
      historyId,
      userId,
      discount,
      evidence,
      ppn,
      price,
      quantity,
    } = params;

    try {
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

          jatuhTempo,
          nomorFaktur,
          paymentStatus,
          totalAmount,
          evidence,
          price,
          ppn,
          quantity,
          discount,
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
    supplierCompanyId?: number,
    dueDateFilter?: "overdue" | "next_3_days" | "next_7_days" | "upcoming",
    paidFilter?: "paid" | "unpaid"
  ) {
    try {
      const totalSupplier = await prisma.supplier.count();

      const pagination = paginationHelper(page, pageSize, totalSupplier);

      // Buat tanggal hari ini dalam UTC (jam 00:00 UTC)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Buat batas akhir next 3 days dalam UTC (jam 23:59:59.999 UTC pada 24 Juni)
      const next3Days = new Date(today);
      next3Days.setUTCDate(today.getUTCDate() + 2);
      next3Days.setUTCHours(23, 59, 59, 999);

      // Next 7 days juga
      const next7Days = new Date(today);
      next7Days.setUTCDate(today.getUTCDate() + 6);
      next7Days.setUTCHours(23, 59, 59, 999);

      const filterMap: Record<string, object> = {
        overdue: {
          jatuhTempo: { lt: today }, // < hari ini = lewat
        },
        next_3_days: {
          jatuhTempo: { gte: today, lte: next3Days }, // termasuk hari ini
        },
        next_7_days: {
          jatuhTempo: { gte: today, lte: next7Days },
        },
        upcoming: {
          jatuhTempo: { gt: next7Days },
        },
      };

      const filterJatuhTempo: Record<string, object> = {
        paid: {
          paymentStatus: "PAID",
        },
        unpaid: {
          paymentStatus: "UNPAID",
        },
      };

      const jatuhTempoFilter = dueDateFilter
        ? filterMap[dueDateFilter] || {}
        : {};

      const paymentStatusFilter = paidFilter
        ? filterJatuhTempo[paidFilter] || {}
        : {};

      const supplier = await prisma.supplier.findMany({
        where: {
          historyId,
          ...(supplierCompanyId ? { supplierCompanyId } : {}),
          ...jatuhTempoFilter,
          ...paymentStatusFilter,
        },
        include: {
          supplierCompany: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
        // skip: pagination.skip,
        // take: pagination.take,
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
        by: ["paymentStatus"],
        where: {
          paymentStatus: {
            in: ["PAID", "UNPAID"],
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
        (status) => status.paymentStatus === "PAID"
      );
      const totalUnpaid = totalPaymentByStatus.find(
        (status) => status.paymentStatus === "UNPAID"
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
    paymentStatus: "PAID" | "UNPAID"
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
        (item: any) => item.totalAmount > 0
      );

      return {
        payment,
        totalPayment: totalPayment._sum.totalAmount ?? 0,
      };
    } catch (error) {
      throw error;
    }
  }

  // async updateSupplier(id: string, params: CreateSupplierDTO) {
  //   const {
  //     discount,
  //     evidence,
  //     paymentStatus,
  //     price,
  //     quantity,
  //     ppn,
  //     supplierCompanyId,
  //     date,
  //     historyId,
  //     userId,
  //   } = params;
  //   try {
  //     const totalAmount = quantity * price + ppn;

  //     const supplier = await prisma.supplier.update({
  //       where: {
  //         id,
  //       },
  //       data: {
  //         supplierCompany: {
  //           connect: {
  //             id: supplierCompanyId,
  //           },
  //         },
  //         histories: {
  //           connect: {
  //             id: historyId,
  //           },
  //         },
  //         user: {
  //           connect: {
  //             id: userId,
  //           },
  //         },
  //         discount,
  //         evidence,
  //         paymentStatus,
  //         price,
  //         quantity,
  //         ppn,
  //         date,
  //         totalAmount,
  //       },
  //       include: {
  //         supplierCompany: {
  //           select: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //       },
  //     });

  //     return supplier;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateSupplier(id: string, params: CreateSupplierDTOV2) {
    const {
      nomorFaktur,
      paymentStatus,
      supplierCompanyId,
      date,
      totalAmount,
      historyId,
      userId,
      jatuhTempo,
      discount,
      evidence,
      ppn,
      price,
      quantity,
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
          nomorFaktur,
          paymentStatus,
          date,
          totalAmount,
          jatuhTempo,
          discount,
          evidence,
          ppn,
          price,
          quantity,
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

  async updateSupplierStatus(id: string[], paymentStatus: "PAID" | "UNPAID") {
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
