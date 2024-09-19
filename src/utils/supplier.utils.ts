export const countSupplierTotalPrice = (
  price: number,
  quantity: number,
  ppn?: number,
) => {
  let totalPrice = 0;

  if (!ppn) {
    totalPrice = price * quantity;
    return totalPrice;
  }

  return (totalPrice = price * quantity + ppn);
};
