import { Response } from 'express';

export const sendSuccessResponse = (
  res: Response,
  data: any = null,
  message: string = 'Request Succesfull',
  statusCode: number = 200,
) => {
  return res.json({
    status: 'success',
    message,
    data,
    statusCode,
    timeStamp: new Date().toISOString(),
  });
};
