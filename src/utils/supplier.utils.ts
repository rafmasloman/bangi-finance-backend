import prisma from '../libs/prisma/orm.libs';

export const countSupplierTotalPrice = (
  price: number,
  quantity: number,
  ppn?: number,
) => {
  let totalPrice = 0;

  if (!ppn) {
    totalPrice = price * quantity;
    return totalPrice;
  }

  return (totalPrice = price * quantity + ppn);
};

export const getPaymentStatusTotalUtils = async (historyId?: string) => {
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
};
