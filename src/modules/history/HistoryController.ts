import { NextFunction, Request, Response } from 'express';
import { CreateHistoryDTO, UpdateHistoryDTO } from '../../dto/HistoryDTO';
import HistoryService from './HistoryService';
import { sendSuccessResponse } from '../../helpers/response.helper';
import {
  CREATE_HISTORY_RESPONSE_MESSAGE,
  DELETE_HISTORY_RESPONSE_MESSAGE,
  READ_DETAIL_HISTORY_RESPONSE_MESSAGE,
  READ_HISTORIES_RESPONSE_MESSAGE,
  UPDATE_HISTORY_RESPONSE_MESSAGE,
} from '../../contants/message_response';
import { BaseRequestType } from '../../middleware/auth.middleware';
import { ExpenseCategories } from '@prisma/client';

class HistoryController {
  private historyService: HistoryService;

  constructor(historyService: HistoryService) {
    this.historyService = historyService;
  }

  createHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        date,
        month,
        remainingEmployeeService,
        remainingManagementService,
        remainingRawMaterials,
        remainingSales,
        remainingTax,
        year,
        userId,
      }: CreateHistoryDTO = req.body;

      const history = await this.historyService.createHistory({
        date,
        month,
        remainingEmployeeService,
        remainingManagementService,
        remainingRawMaterials,
        remainingSales,
        remainingTax,
        year,
        userId,
      });

      return sendSuccessResponse(
        res,
        history,
        CREATE_HISTORY_RESPONSE_MESSAGE,
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllHistories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { month, year } = req.query as { month?: string; year?: string };

      const histories = await this.historyService.getAllHistories(month, year);

      return sendSuccessResponse(
        res,
        histories,
        READ_HISTORIES_RESPONSE_MESSAGE,
      );
    } catch (error) {
      next(error);
    }
  };

  getDetailHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const history = await this.historyService.getDetailHistory(id);

      return sendSuccessResponse(
        res,
        history,
        READ_DETAIL_HISTORY_RESPONSE_MESSAGE,
      );
    } catch (error) {
      next(error);
    }
  };

  getHistoryExpenseMasterDataStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { historyId, name } = req.query as {
        historyId: string;
        name: ExpenseCategories;
      };

      const historyExpenseStats =
        await this.historyService.getHistoryExpenseMasterDataStats(
          historyId,
          name,
        );

      return sendSuccessResponse(
        res,
        historyExpenseStats,
        'Expense Master Data Stats fetched succesfully',
      );
    } catch (error) {
      next(error);
    }
  };

  getHistoryRemainingData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { historyId } = req.params;
      const { categoryName } = req.query as {
        categoryName: string;
      };

      const historyExpenseStats =
        await this.historyService.getHistoryRemainingData(historyId);

      return sendSuccessResponse(
        res,
        historyExpenseStats,
        'History remaining data fetched succesfully',
      );
    } catch (error) {
      next(error);
    }
  };

  getAllHistoryByUser = async (
    req: BaseRequestType,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User Not Found');
      }

      const historiesUser = await this.historyService.getAllHistoryByUserId(
        userId,
      );

      return sendSuccessResponse(
        res,
        historiesUser,
        'Histories User fetch succesfully',
      );
    } catch (error) {
      next(error);
    }
  };

  getMDRHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const mdr = await this.historyService.getMDRHistory(id);

      return sendSuccessResponse(res, mdr, 'MDR fetched successfully');
    } catch (error) {
      next(error);
    }
  };

  updateHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        date,
        month,
        remainingEmployeeService,
        remainingManagementService,
        remainingRawMaterials,
        remainingSales = 0,
        remainingTax,
      }: UpdateHistoryDTO = req.body;
      const history = await this.historyService.updateHistory(id, {
        date,
        month,
        remainingEmployeeService,
        remainingManagementService,
        remainingRawMaterials,
        remainingSales,
        remainingTax,
      });
      return sendSuccessResponse(
        res,
        history,
        UPDATE_HISTORY_RESPONSE_MESSAGE,
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  updateMDR = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { mdr } = req.body;

      const updateMDR = await this.historyService.updateMDR(id, { mdr });

      console.log('update : ', updateMDR);

      return sendSuccessResponse(
        res,
        updateMDR,
        'MDR updated successfully',
        201,
      );
    } catch (error) {
      console.log('error : ', error);

      next(error);
    }
  };

  deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const history = await this.historyService.deleteHistory(id);
      return sendSuccessResponse(res, history, DELETE_HISTORY_RESPONSE_MESSAGE);
    } catch (error) {
      next(error);
    }
  };
}

export default HistoryController;
