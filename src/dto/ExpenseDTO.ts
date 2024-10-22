export class CreateExpenseDTO {
  evidence: string;
  price: number;
  expenseCategoryId: number;
  userId: string;
  note: string;
  date: Date;
  historyId: string;
}

export class UpdateExpenseDTO {
  evidence?: string;
  price?: number;
  expenseCategoryId?: number;
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
