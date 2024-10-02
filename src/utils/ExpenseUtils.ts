import prisma from '../libs/prisma/orm.libs';

class ExpenseUtils {
  async calculateTotalByCategory(category: string) {
    try {
      const totalCategories = await prisma.expense.findMany({
        where: {
          expenseCategory: {
            name: category,
          },
        },
      });

      const countTotalCategory = totalCategories.reduce(
        (accumulator, item) => accumulator + item.price,
        0,
      );

      return countTotalCategory;
    } catch (error) {
      throw error;
    }
  }
}

const expenseUtils = new ExpenseUtils();

export default expenseUtils;
