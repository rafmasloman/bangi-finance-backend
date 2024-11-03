import exceljs from 'exceljs';
import prisma from '../prisma/orm.libs';

export const exportFileToExcel = async () => {
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  const income = await prisma.income.findMany();

  worksheet.columns = [
    { header: 'No', key: 'no', width: 10 },
    { header: 'Tanggal & Waktu', key: 'date', width: 30 },
    { header: 'Item Sales', key: 'item-sales', width: 30 },
  ];

  const incomeRows = income.map((inc, index) => {
    return {
      no: index + 1,
      date: inc.date,
      itemSales: inc.itemSales,
    };
  });

  const row = worksheet.addRow(incomeRows);
};
