import { NextFunction, Request, Response } from "express";
import {
  CreateSupplierCompanyDTO,
  UpdateSupplierCompanyDTO,
} from "../../dto/SupplierCompanyDTO";
import SupplierCompanyService from "./SupplierCompanyService";
import { sendSuccessResponse } from "../../helpers/response.helper";

class SupplierCompanyController {
  private supplierCompanyService: SupplierCompanyService;

  constructor(supplierCompanyService: SupplierCompanyService) {
    this.supplierCompanyService = supplierCompanyService;
  }

  createSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name }: CreateSupplierCompanyDTO = req.body;

      const supplierCompanies =
        await this.supplierCompanyService.createSupplierCompany({ name });

      return sendSuccessResponse(
        res,
        supplierCompanies,
        "Supplier Companies created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getAllSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const supplierCompanies =
        await this.supplierCompanyService.getAllSuplierCompany();

      return sendSuccessResponse(
        res,
        supplierCompanies,
        "Supplier Companies fetched succesfully"
      );
    } catch (error) {
      next(error);
    }
  };

  getSupplierCompanyBySupplier = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const supplierCompanies =
        await this.supplierCompanyService.getAllSupplierCompanyBySupplier();

      return sendSuccessResponse(
        res,
        supplierCompanies,
        "Supplier Companies fetched succesfully"
      );
    } catch (error) {
      next(error);
    }
  };

  getDetailSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    try {
      const supplierCompany =
        await this.supplierCompanyService.getSupplierCompanyDetail(id);

      return sendSuccessResponse(
        res,
        supplierCompany,
        "Supplier Company Detail fetched succesfully"
      );
    } catch (error) {
      next(error);
    }
  };

  updateSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, supplierId }: UpdateSupplierCompanyDTO = req.body;
      const { id } = req.params;
      const supplierCompanies =
        await this.supplierCompanyService.updateSuplierCompany(Number(id), {
          name,
        });

      return sendSuccessResponse(
        res,
        supplierCompanies,
        "Supplier Companies updated successfully",
        200
      );
    } catch (error) {
      next(error);
    }
  };

  deleteSupplierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const supplierCompanies =
        await this.supplierCompanyService.deleteSuplierCompany(Number(id));

      return sendSuccessResponse(
        res,
        supplierCompanies,
        "Supplier Companies deleted successfully",
        200
      );
    } catch (error) {
      next(error);
    }
  };
}

export default SupplierCompanyController;
