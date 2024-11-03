import { ExpenseCategories } from '@prisma/client';

export class CreateExpenseDTO {
  evidence: string;
  price: number;
  expenseCategory: ExpenseCategories;
  userId: string;
  note: string;
  date: Date;
  historyId: string;
}

export class UpdateExpenseDTO {
  evidence?: string;
  price?: number;
  expenseCategory: ExpenseCategories;
  note?: string;
  date?: Date;
  userId?: string;
  historyId?: string;
}

export class CreateExpenseCategoryDTO {
  name: string;
}

export class UpdateExpenseCategoryDTO {
  name?: string;
}
