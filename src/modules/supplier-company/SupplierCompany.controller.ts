import { NextFunction, Request, Response } from 'express';
import { CreateSupplierCompanyDTO } from '../../dto/SupplierCompanyDTO';
import SupplierCompanyService from './SupplierCompanyService';
import { sendSuccessResponse } from '../../helpers/response.helper';

class SupplierCompanyController {
  private supplierCompanyService: SupplierCompanyService;

  constructor(supplierCompanyService: SupplierCompanyService) {
    this.supplierCompanyService = supplierCompanyService;
  }

  createSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name }: CreateSupplierCompanyDTO = req.body;

      const supplierCompanies =
        await this.supplierCompanyService.createSupplierCompany({ name });

      return sendSuccessResponse(
        res,
        supplierCompanies,
        'Supplier Companies created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const supplierCompanies =
        await this.supplierCompanyService.getAllSuplierCompany();

      return sendSuccessResponse(
        res,
        supplierCompanies,
        'Supplier Companies fetched succesfully',
      );
    } catch (error) {
      next(error);
    }
  };
}

export default SupplierCompanyController;
