import { CreateHistoryDTO, UpdateHistoryDTO } from '../../dto/HistoryDTO';
import prisma from '../../libs/prisma/orm.libs';

class HistoryService {
  async createHistory(payload: CreateHistoryDTO) {
    try {
      const history = await prisma.history.create({
        data: {
          month: payload.month,
          remainingEmployeeService: payload.remainingEmployeeService,
          remainingManagementService: payload.remainingManagementService,
          remainingRawMaterials: payload.remainingRawMaterials,
          remainingSales: payload.remainingSales,
          remainingTax: payload.remainingTax,
          date: payload.date,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async getAllHistories(month?: string) {
    try {
      const history = await prisma.history.findMany({
        where: {
          month,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async updateHistory(id: string, payload: UpdateHistoryDTO) {
    try {
      const history = await prisma.history.update({
        where: {
          id,
        },
        data: {
          ...payload,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async deleteHistory(id: string) {
    try {
      const history = await prisma.history.delete({
        where: {
          id,
        },
      });

      return history;
    } catch (error) {
      throw error;
    }
  }
}

export default HistoryService;
