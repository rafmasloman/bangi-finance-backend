import { Router } from 'express';
import SupplierController from './SupplierController';
import { authMiddleware } from '../../middleware/auth.middleware';

class SupplierRoute {
  private supplierController: SupplierController;
  private route: Router;

  constructor(supplierController: SupplierController) {
    this.supplierController = supplierController;
    this.route = Router();
  }

  createSupplierRoute() {
    return this.route.post(
      '/',
      // authMiddleware,
      this.supplierController.createSupplier,
    );
  }

  getAllSupplierRoute() {
    return this.route.get(
      '/',
      // authMiddleware,
      this.supplierController.getAllSuppliers,
    );
  }

  getDetailSupplierRoute() {
    return this.route.get('/:id', this.supplierController.getDetailSupplier);
  }

  updateSupplierRoute() {
    return this.route.put(
      '/:id',
      // authMiddleware,
      this.supplierController.updateSupplier,
    );
  }

  deleteSupplierRoute() {
    return this.route.delete(
      '/:id',
      // authMiddleware,
      this.supplierController.deleteSupplier,
    );
  }

  registerRoute() {
    this.createSupplierRoute();
    this.getDetailSupplierRoute();
    this.getAllSupplierRoute();
    this.updateSupplierRoute();
    this.deleteSupplierRoute();

    return this.route;
  }
}

export default SupplierRoute;
