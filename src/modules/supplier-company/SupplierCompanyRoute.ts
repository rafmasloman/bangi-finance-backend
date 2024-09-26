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

  getDetailRoute() {
    return this.router.get(
      '/:id',
      this.supplierCompanyController.getDetailSupplierCompany,
    );
  }

  updateRoute() {
    return this.router.put(
      '/:id',
      //   authMiddleware,
      this.supplierCompanyController.updateSupplierCompany,
    );
  }

  deleteRoute() {
    return this.router.delete(
      '/:id',
      //   authMiddleware,
      this.supplierCompanyController.deleteSupplierCompany,
    );
  }

  registerRoute() {
    this.createRoute();
    this.getAllRoute();
    this.updateRoute();
    this.deleteRoute();
    this.getDetailRoute();

    return this.router;
  }
}

export default SupplierCompanyRoutes;
