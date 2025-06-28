import ExcelJS from "exceljs";

export const generateExcelWorkbook = () => {
  const workbook = new ExcelJS.Workbook();
  return workbook;
};
