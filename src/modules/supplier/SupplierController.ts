import { NextFunction, Request, Response } from 'express';
import SupplierService from './SupplierService';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../../dto/SupplierDTO';
import { countSupplierTotalPrice } from '../../utils/supplier.utils';
import { sendSuccessResponse } from '../../helpers/response.helper';
import {
  CREATE_SUPPLIER_MESSAGE,
  DELETE_SUPPLIER_MESSAGE,
  READ_EXPENSES_MESSAGE,
  READ_SUPPLIER_DETAIL_MESSAGE,
  READ_SUPPLIER_PAYMENT_STATUS_AMOUNT,
  UPDATE_SUPPLIER_MESSAGE,
} from '../../contants/message_response';

class SupplierController {
  private supplierService: SupplierService;

  constructor(supplierService: SupplierService) {
    this.supplierService = supplierService;
  }

  createSupplier = async (req: Request, res: Response, next: NextFunction) => {
    console.log('data : ', req.body);

    try {
      const {
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        supplierCompanyId,
        date,
        userId,
      }: CreateSupplierDTO = req.body;

      const supplier = await this.supplierService.createSupplier({
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        supplierCompanyId,
        date,
        userId,
      });

      const totalPrice = countSupplierTotalPrice(
        supplier.price,
        supplier.quantity,
        supplier.ppn,
      );

      return sendSuccessResponse(
        res,
        { supplier, totalPrice },
        CREATE_SUPPLIER_MESSAGE,
        201,
      );
    } catch (error) {
      console.log('error : ', error);

      next(error);
    }
  };

  getAllSuppliers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = req.query;

      const suppliers = await this.supplierService.getAllSuppliers(
        Number(page),
        Number(pageSize),
      );

      return sendSuccessResponse(res, suppliers, READ_EXPENSES_MESSAGE);
    } catch (error) {
      next(error);
    }
  };

  getDetailSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const supplier = await this.supplierService.getSupplierDetail(id);

      return sendSuccessResponse(res, supplier, READ_SUPPLIER_DETAIL_MESSAGE);
    } catch (error) {
      next(error);
    }
  };

  getAmountSupplierPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const supplierAmount = await this.supplierService.getPaymentStatusTotal();

      return sendSuccessResponse(
        res,
        supplierAmount,
        READ_SUPPLIER_PAYMENT_STATUS_AMOUNT,
      );
    } catch (error) {
      next(error);
    }
  };

  updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const {
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        date,
        supplierCompanyId,
        userId,
      }: UpdateSupplierDTO = req.body;

      const supplier = await this.supplierService.updateSupplier(id, {
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        date,
        supplierCompanyId,
        userId,
      });

      const totalPrice = countSupplierTotalPrice(
        supplier.price,
        supplier.quantity,
        supplier.ppn,
      );

      return sendSuccessResponse(
        res,
        { supplier, totalPrice },
        UPDATE_SUPPLIER_MESSAGE,
      );
    } catch (error) {
      next(error);
    }
  };

  deleteSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const supplier = await this.supplierService.deleteSupplier(id);

      return sendSuccessResponse(res, null, DELETE_SUPPLIER_MESSAGE);
    } catch (error) {
      next(error);
    }
  };
}

export default SupplierController;
