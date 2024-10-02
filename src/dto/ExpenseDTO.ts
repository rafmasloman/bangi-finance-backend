export class CreateExpenseDTO {
  evidence: string;
  price: number;
  expenseCategoryId: number;
  userId: string;
  note: string;
  date: Date;
}

export class UpdateExpenseDTO {
  evidence?: string;
  price?: number;
  expenseCategoryId?: number;
  note?: string;
  date?: Date;
}

export class CreateExpenseCategoryDTO {
  name: string;
}

export class UpdateExpenseCategoryDTO {
  name?: string;
}
