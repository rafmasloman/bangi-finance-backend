export interface CreateHistoryDTO {
  date: Date;
  remainingEmployeeService: number;
  remainingManagementService: number;
  remainingTax: number;
  remainingSales: number;
  remainingRawMaterials: number;
  month: string;
}

export interface UpdateHistoryDTO {
  date?: Date;
  remainingEmployeeService?: number;
  remainingManagementService?: number;
  remainingTax?: number;
  remainingSales?: number;
  remainingRawMaterials?: number;
  month?: string;
}
