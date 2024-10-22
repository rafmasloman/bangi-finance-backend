export const paginationHelper = (
  page?: number,
  pageSize?: number,
  totalData?: number,
) => {
  const skip = !!page && !!pageSize ? (page - 1) * pageSize : undefined;
  const take = pageSize || undefined;
  const totalPage =
    !!pageSize && !!totalData ? Math.ceil(totalData / pageSize) : undefined;

  return { skip, take, totalPage };
};
