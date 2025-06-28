import ExcelJS from "exceljs";
import prisma from "../libs/prisma/orm.libs";

const headerExcelStyle = (cell: ExcelJS.Cell) => {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF107C41" }, // Background hijau (seperti Excel green)
  };
  cell.font = { color: { argb: "FFFFFFFF" } };
  cell.alignment = { vertical: "middle", horizontal: "center" };
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
};

const incomeExcelHeadersColumn = [
  { header: "Tanggal", key: "date", width: 20 },
  {
    header: "FOC Bill",
    key: "focBill",
    width: 15,
    height: 25,
    style: { numFmt: "#,##0" },
  },
  {
    header: "FOC Item",
    key: "focItem",
    width: 15,
    style: { numFmt: "#,##0" },
  },
  {
    header: "Bill Discount",
    key: "billDiscount",
    width: 15,
    style: { numFmt: "#,##0" },
  },
  {
    header: "Item Discount",
    key: "itemDiscount",
    width: 15,
    style: { numFmt: "#,##0" },
  },
  {
    header: "Item Sales",
    key: "itemSales",
    width: 15,
    style: { numFmt: "#,##0" },
  },
  { header: "PPN", key: "ppn", width: 10, style: { numFmt: "#,##0" } },
  {
    header: "Service",
    key: "service",
    width: 10,
    style: { numFmt: "#,##0" },
  },
  {
    header: "Total Sales",
    key: "totalSales",
    width: 15,
    style: { numFmt: "#,##0" },
  },
  {
    header: "Total Collection",
    key: "totalCollection",
    width: 18,
    style: { numFmt: "#,##0" },
  },
];

const supplierExcelHeadersColumn = [
  { header: "Tanggal", key: "date", width: 20 },
  { header: "Nama Supplier", key: "name", width: 20 },
  { header: "Diskon", key: "discount", width: 10 },
  { header: "Bukti", key: "evidence", width: 20 },
  { header: "Nomor Faktur", key: "nomorFaktur", width: 20 },
  { header: "Jatuh Tempo", key: "jatuhTempo", width: 20 },
  { header: "Status Pembayaran", key: "paymentStatus", width: 20 },
  { header: "PPN", key: "ppn", width: 10 },
  { header: "Harga", key: "price", width: 15 },
  { header: "Quantity", key: "quantity", width: 10 },
  {
    header: "Total",
    key: "totalAmount",
    width: 15,
    style: { numFmt: "#,##0" },
  },
];

const expenseExcelHeadersColumn = [
  { header: "Tanggal", key: "date", width: 20 },
  {
    header: "Kategori Pengeluaran",
    key: "expenseCategory",
    width: 20,
  },
  { header: "Harga", key: "price", width: 15, style: { numFmt: "#,##0" } },
  { header: "Bukti", key: "evidence", width: 40 },
  { header: "Keterangan", key: "note", width: 80 },
];

export const generateIncomeExcelData = async (
  workbook: ExcelJS.Workbook,
  historyId: string
) => {
  const incomeSheet = workbook.addWorksheet("Income");

  incomeSheet.columns = incomeExcelHeadersColumn;

  incomeSheet.columns.forEach((column) => {
    column.alignment = { vertical: "top", wrapText: true };
  });

  const headerRow = incomeSheet.getRow(1);

  headerRow.height = 50;
  headerRow.eachCell((cell) => headerExcelStyle(cell));

  const incomes = await prisma.income.findMany({
    where: {
      historyId,
    },
    select: {
      date: true,
      focBill: true,
      focItem: true,
      billDiscount: true,
      itemDiscount: true,
      itemSales: true,
      ppn: true,
      service: true,
      totalCollection: true,
      totalSales: true,
    },
  });

  const mappingIncome = incomes.forEach((income) => {
    incomeSheet.addRow({
      date: income.date,
      focBill: income.focBill,
      focItem: income.focItem,
      billDiscount: income.billDiscount,
      itemDiscount: income.itemDiscount,
      itemSales: income.itemSales,
      ppn: income.ppn,
      service: income.service,
      totalCollection: income.totalCollection,
      totalSales: income.totalSales,
    });
  });

  return mappingIncome;
};

export const generateSupplierExcelData = async (
  workbook: ExcelJS.Workbook,
  historyId: string
) => {
  const supplierSheet = workbook.addWorksheet("Supplier");

  supplierSheet.columns = supplierExcelHeadersColumn;

  supplierSheet.columns.forEach((column) => {
    column.alignment = { vertical: "top", wrapText: true };
  });

  const headerRow = supplierSheet.getRow(1);

  headerRow.height = 50;
  headerRow.eachCell((cell) => headerExcelStyle(cell));

  const suppliers = await prisma.supplierCompany.findMany({
    select: {
      name: true,

      suppliers: {
        select: {
          date: true,
          discount: true,
          evidence: true,
          nomorFaktur: true,
          jatuhTempo: true,
          paymentStatus: true,
          ppn: true,
          price: true,
          quantity: true,
          totalAmount: true,
        },
        where: {
          historyId,
        },
      },
    },
  });

  const mappingSuppliers = suppliers.map((item) => {
    item.suppliers.forEach((ctx) => {
      supplierSheet.addRow({
        date: ctx.date,
        discount: ctx.discount,
        evidence: ctx.evidence,
        nomorFaktur: ctx.nomorFaktur,
        jatuhTempo: ctx.jatuhTempo,
        paymentStatus: ctx.paymentStatus ? "Sudah Bayar" : "Belum Bayar",
        ppn: ctx.ppn,
        price: ctx.price,
        quantity: ctx.quantity,
        totalAmount: ctx.totalAmount,
        name: item.name,
      });
    });
  });

  return mappingSuppliers;
};

export const generateExpenseExcelData = async (
  workbook: ExcelJS.Workbook,
  historyId: string
) => {
  const expenseSheet = workbook.addWorksheet("Expense");

  expenseSheet.columns = expenseExcelHeadersColumn;

  expenseSheet.columns.forEach((column) => {
    column.alignment = { vertical: "top", wrapText: true };
  });

  const headerRow = expenseSheet.getRow(1);

  headerRow.height = 50;
  headerRow.eachCell((cell) => headerExcelStyle(cell));

  const expenses = await prisma.expense.findMany({
    select: {
      date: true,
      evidence: true,
      expenseCategory: true,
      note: true,
      price: true,
    },
  });

  const mappingExpense = expenses.map((item) => {
    expenseSheet.addRow({
      date: item.date,
      evidence: item.evidence === "" ? "" : item.evidence,
      note: item.note === "" ? "" : item.note,
      expenseCategory: item.expenseCategory,
      price: item.price,
    });
  });

  return mappingExpense;
};

export const exportAllDataByHistory = async (
  type: string,
  historyId: string,
  workbook: ExcelJS.Workbook
) => {
  try {
    switch (type) {
      case "incomes":
        await generateIncomeExcelData(workbook, historyId);
        break;

      case "supplier":
        await generateSupplierExcelData(workbook, historyId);
        break;

      case "expense":
        await generateExpenseExcelData(workbook, historyId);
        break;

      default:
        console.log("choose exported default ");
        await generateIncomeExcelData(workbook, historyId);
        await generateSupplierExcelData(workbook, historyId);
        await generateExpenseExcelData(workbook, historyId);

        break;
    }
  } catch (error) {
    throw error;
  }
};
