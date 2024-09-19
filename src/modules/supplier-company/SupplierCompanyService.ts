import prisma from '../../libs/prisma/orm.libs';

class SupplierCompanyService {
  async createSupplierCompany() {
    try {
      const supplierCompany = await prisma.supplierCompany.create({
        data: {
          name: '',
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
