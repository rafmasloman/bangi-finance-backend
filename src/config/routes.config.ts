import AuthService from '../modules/auth/AuthService';
import AuthRoute from '../modules/auth/AuthRoute';
import UserService from '../modules/user/UserService';
import UserController from '../modules/user/UserController';
import UserRoute from '../modules/user/UserRoute';
import AuthController from '../modules/auth/AuthController';
import SupplierService from '../modules/supplier/SupplierService';
import ExpenseCategoryService from '../modules/expense-category/ExpenseCategoryService';
import ExpenseCategoryController from '../modules/expense-category/ExpenseCategoryController';
import SupplierController from '../modules/supplier/SupplierController';
import SupplierRoute from '../modules/supplier/SupplierRoute';
import IncomeService from '../modules/income/IncomeService';
import IncomeController from '../modules/income/IncomeController';
import ExpenseCategoryRoute from '../modules/expense-category/ExpenseCategoryRoute';
import IncomeRoute from '../modules/income/IncomeRoute';
import { Router } from 'express';

const routes = Router();
// Inisialisasi services dan controllers
const AuthServices = new AuthService();
const UserServices = new UserService();
const SupplierServices = new SupplierService();
const ExpenseCategoryServices = new ExpenseCategoryService();
const IncomeServices = new IncomeService();

const AuthControllers = new AuthController(AuthServices);
const UserControllers = new UserController(UserServices);
const SupplierControllers = new SupplierController(SupplierServices);
const ExpenseCategoryControllers = new ExpenseCategoryController(
  ExpenseCategoryServices,
);
const IncomeControllers = new IncomeController(IncomeServices);

// Route Definitions
const AuthRoutes = new AuthRoute(AuthControllers);
const UserRoutes = new UserRoute(UserControllers);
const ExpenseCategoryRoutes = new ExpenseCategoryRoute(
  ExpenseCategoryControllers,
);
const SupplierRoutes = new SupplierRoute(SupplierControllers);

const IncomeRoutes = new IncomeRoute(IncomeControllers);

// Daftarkan route di sini tanpa prefix
routes.use('/auth', AuthRoutes.getRoute());
routes.use('/user', UserRoutes.getRoute());
routes.use('/expense-category', ExpenseCategoryRoutes.getRoutes());
routes.use('/supplier', SupplierRoutes.registerRoute());
routes.use('/income', IncomeRoutes.registerRoute());

export default routes;
