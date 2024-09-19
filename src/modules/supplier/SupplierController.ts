import { NextFunction, Request, Response } from 'express';
import SupplierService from './SupplierService';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../../dto/SupplierDTO';
import { countSupplierTotalPrice } from '../../utils/supplier.utils';

class SupplierController {
  private supplierService: SupplierService;

  constructor(supplierService: SupplierService) {
    this.supplierService = supplierService;
    this.createSupplier = this.createSupplier.bind(this);
    this.getAllSuppliers = this.getAllSuppliers.bind(this);
    this.updateSupplier = this.updateSupplier.bind(this);
    this.deleteSupplier = this.deleteSupplier.bind(this);
  }

  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        supplierCompanyId,
      }: CreateSupplierDTO = req.body;
      const supplier = await this.supplierService.createSupplier({
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        supplierCompanyId,
      });

      const totalPrice = countSupplierTotalPrice(
        supplier.price,
        supplier.quantity,
        supplier.ppn,
      );

      return res.json({
        statusCode: 201,
        message: 'Supplier data created',
        data: {
          ...supplier,
          totalPrice,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize } = req.query;

      const suppliers = await this.supplierService.getAllSuppliers(
        Number(page),
        Number(pageSize),
      );

      return res.json({
        message: 'Suppliers Success to get',
        data: suppliers.supplier,
        page,
        pageSize,
        totalPages: suppliers.totalSupplier,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const {
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        supplierCompanyId,
      }: UpdateSupplierDTO = req.body;

      const supplier = await this.supplierService.updateSupplier(id, {
        discount,
        evidence,
        paymentStatus,
        ppn,
        price,
        quantity,
        supplierCompanyId,
      });

      const totalPrice = countSupplierTotalPrice(
        supplier.price,
        supplier.quantity,
        supplier.ppn,
      );

      return res.json({
        statusCode: 201,
        message: 'Supplier data updated',
        data: {
          ...supplier,
          totalPrice,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const supplier = await this.supplierService.deleteSupplier(id);

      return res.json({
        statsuCode: 200,
        message: 'Supplier Deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SupplierController;
