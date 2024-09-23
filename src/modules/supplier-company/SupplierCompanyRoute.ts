import { Router } from 'express';
import SupplierCompanyController from './SupplierCompany.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

class SupplierCompanyRoutes {
  private supplierCompanyController: SupplierCompanyController;
  private router: Router;

  constructor(supplierCompanyController: SupplierCompanyController) {
    this.supplierCompanyController = supplierCompanyController;
    this.router = Router();
  }

  createRoute() {
    return this.router.post(
      '/',
      //   authMiddleware,
      this.supplierCompanyController.createSupplierCompany,
    );
  }

  getAllRoute() {
    return this.router.get(
      '/',
      //   authMiddleware,
      this.supplierCompanyController.getAllSupplierCompany,
    );
  }

  registerRoute() {
    this.createRoute();
    this.getAllRoute();

    return this.router;
  }
}

export default SupplierCompanyRoutes;
