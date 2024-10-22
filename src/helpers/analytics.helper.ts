const calculateHistoryExpenseService = (
  data: { totalAmount: number }[],
  remainingAmount: number,
) => {
  const totalSalesAnalytics = data.reduce(
    (acc, currentValue) => acc + currentValue.totalAmount,
    0,
  );
};
