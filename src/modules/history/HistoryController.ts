import { NextFunction, Request, Response } from 'express';
import { CreateHistoryDTO, UpdateHistoryDTO } from '../../dto/HistoryDTO';
import HistoryService from './HistoryService';
import { sendSuccessResponse } from '../../helpers/response.helper';
import {
  CREATE_HISTORY_RESPONSE_MESSAGE,
  DELETE_HISTORY_RESPONSE_MESSAGE,
  READ_HISTORIES_RESPONSE_MESSAGE,
  UPDATE_HISTORY_RESPONSE_MESSAGE,
} from '../../contants/message_response';

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
      }: CreateHistoryDTO = req.body;

      const history = await this.historyService.createHistory({
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
        CREATE_HISTORY_RESPONSE_MESSAGE,
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllHistories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const histories = await this.historyService.getAllHistories();

      return sendSuccessResponse(
        res,
        histories,
        READ_HISTORIES_RESPONSE_MESSAGE,
        201,
      );
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
        remainingSales,
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

  deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const history = await this.historyService.deleteHistory(id);
      return sendSuccessResponse(
        res,
        history,
        DELETE_HISTORY_RESPONSE_MESSAGE,
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

export default HistoryController;
