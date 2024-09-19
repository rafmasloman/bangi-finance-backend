export class CreateExpenseDTO {
  evidence: string;
  price: number;
  expenseCategoryId: number;
  note: string;
}

export class UpdateExpenseDTO {
  evidence?: string;
  price?: number;
  expenseCategoryId?: number;
  note?: string;
}

export class CreateExpenseCategoryDTO {
  name: string;
}

export class UpdateExpenseCategoryDTO {
  name?: string;
}
