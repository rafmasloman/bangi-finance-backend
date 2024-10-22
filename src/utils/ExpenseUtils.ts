import prisma from '../libs/prisma/orm.libs';

class ExpenseUtils {
  async calculateTotalByCategory(category: string, historyId: string) {
    try {
      // const totalCategories = await prisma.expense.findMany({
      //   where: {
      //     expenseCategory: {
      //       name: {
      //         in: ['SALES'],
      //       },
      //     },
      //     histories: {
      //       id: historyId,
      //     },
      //   },
      // });

      // const countTotalCategory = totalCategories.reduce(
      //   (accumulator, item) => accumulator + item.price,
      //   0,
      // );

      const totalCategories = await prisma.expense.groupBy({
        by: ['expenseCategoryId'],
        where: {
          expenseCategory: {
            name: {
              in: ['SALES', 'PPN'],
            },
          },
          histories: {
            id: historyId,
          },
        },
      });

      const categoriesWithNames = await Promise.all(
        totalCategories.map(async (item: any) => {
          const categoryName = await prisma.expenseCategory.findUnique({
            where: { id: item.expenseCategoryId },
            select: { name: true },
          });

          return {
            amount: {
              ...item,
            },
            expenseCategoryName: categoryName?.name,
          };
        }),
      );

      return categoriesWithNames;
    } catch (error) {
      throw error;
    }
  }
}

const expenseUtils = new ExpenseUtils();

export default expenseUtils;
