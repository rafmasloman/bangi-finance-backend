import {
  CreateSupplierCompanyDTO,
  UpdateSupplierCompanyDTO,
} from '../../dto/SupplierCompanyDTO';
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
      const companies = await prisma.supplierCompany.findMany();

      return companies;
    } catch (error) {
      throw error;
    }
  }

  async deleteSuplierCompany(id: number) {
    try {
      const company = await prisma.supplierCompany.delete({
        where: {
          id,
        },
      });

      return company;
    } catch (error) {
      throw error;
    }
  }

  async updateSuplierCompany(id: number, payload: UpdateSupplierCompanyDTO) {
    try {
      const company = await prisma.supplierCompany.update({
        where: {
          id,
        },
        data: {
          name: payload.name,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default SupplierCompanyService;
