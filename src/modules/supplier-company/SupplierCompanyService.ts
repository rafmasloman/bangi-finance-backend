import { CreateSupplierCompanyDTO } from '../../dto/SupplierCompanyDTO';
import prisma from '../../libs/prisma/orm.libs';

class SupplierCompanyService {
  async createSupplierCompany(payload: CreateSupplierCompanyDTO) {
    try {
      const supplierCompany = await prisma.supplierCompany.create({
        data: {
          ...payload,
        },
      });

      return supplierCompany;
    } catch (error) {
      throw error;
    }
  }

  async getAllSuplierCompany() {
    try {
      const companies = prisma.supplierCompany.findMany();

      return companies;
    } catch (error) {
      throw error;
    }
  }
}

export default SupplierCompanyService;
