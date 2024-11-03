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
  READ_SUPPLIERS_MESSAGE,
  UPDATE_SUPPLIER_MESSAGE,
} from '../../contants/message_response';
import { BaseRequestType } from '../../middleware/auth.middleware';

class SupplierController {
  private supplierService: SupplierService;

  constructor(supplierService: SupplierService) {
    this.supplierService = supplierService;
  }

  createSupplier = async (req: Request, res: Response, next: NextFunction) => {
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
        historyId,
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
        historyId,
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

  getAllSuppliers = async (
    req: BaseRequestType,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, pageSize, historyId } = req.query;

      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User Not Found');
      }

      const suppliers = await this.supplierService.getAllSuppliers(
        String(historyId),
        userId,
        Number(page),
        Number(pageSize),
      );

      return sendSuccessResponse(res, suppliers, READ_SUPPLIERS_MESSAGE);
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
      const { historyId } = req.params;

      const supplierAmount = await this.supplierService.getPaymentStatusTotal(
        historyId,
      );

      return sendSuccessResponse(
        res,
        supplierAmount,
        READ_SUPPLIER_PAYMENT_STATUS_AMOUNT,
      );
    } catch (error) {
      next(error);
    }
  };

  getPaymentTotalBySupplier = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.query;

      const supplierPayments =
        await this.supplierService.getPaymentTotalBySupplier(
          id,
          paymentStatus as 'PAID' | 'UNPAID',
        );

      return sendSuccessResponse(
        res,
        supplierPayments,
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
        historyId,
      }: CreateSupplierDTO = req.body;

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
        historyId,
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
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  updateSupplierPaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { supplierId, paymentStatus } = req.body;
      console.log('body : ', req.body);

      const supplier = await this.supplierService.updateSupplierStatus(
        supplierId,
        paymentStatus as 'PAID' | 'UNPAID',
      );

      console.log('supplier');

      return sendSuccessResponse(
        res,
        supplier,
        'Supplier Payment Status updated successfully',
      );
    } catch (error) {
      console.log('error : ', error);

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
