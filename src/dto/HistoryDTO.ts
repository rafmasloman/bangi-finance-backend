export interface CreateHistoryDTO {
  date: Date;
  remainingEmployeeService: number;
  remainingManagementService: number;
  remainingTax: number;
  remainingSales: number;
  remainingRawMaterials: number;
  month: string;
  year: string;
  userId?: string;
}

export interface UpdateHistoryDTO {
  date?: Date;
  remainingEmployeeService?: number;
  remainingManagementService?: number;
  remainingTax?: number;
  remainingSales?: number;
  remainingRawMaterials?: number;
  month?: string;
  year?: string;
  userId?: string;
}
