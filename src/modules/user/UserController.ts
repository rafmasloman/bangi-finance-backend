import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import UserService from './UserService';
import { CreateUserDTO } from '../../dto/UserDTO';
import { sendSuccessResponse } from '../../helpers/response.helper';
import { BaseRequestType } from '../../middleware/auth.middleware';

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    // const userDTO = plainToInstance(CreateUserDTO, req.body);
    // const error = await validate(userDTO);

    // const {
    //   email,
    //   password,
    //   role,
    //   username,
    //   firstname,
    //   lastname,
    //   phoneNumber,
    // } = req.body;

    // if (error.length > 0) {
    //   next(error);
    // }

    const {
      email,
      password,
      role,
      username,
      firstname,
      lastname,
      phoneNumber,
    }: CreateUserDTO = req.body;
    try {
      const user = this.userService.createUser({
        email,
        password,
        role,
        username,
        firstname,
        lastname,
        phoneNumber,
      });

      return res.json({
        statusCode: 201,
        message: 'Created user',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (
    req: BaseRequestType,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User Not Found');
      }

      const { page, pageSize } = req.query as {
        page?: string;
        pageSize?: string;
      };

      const users = await this.userService.getAllUsers(
        Number(page),
        Number(pageSize),
      );

      return res.json({
        statusCode: 200,
        message: 'Success Get All Users Data',
        data: users,
      });
    } catch (error) {
      console.log('error : ', error);

      next(error);
    }
  };

  getDetailUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await this.userService.getDetailUser(id);

      return sendSuccessResponse(
        res,
        user,
        'Detail user fetched succesfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.deleteUser(id);

      return sendSuccessResponse(res, null, 'User deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
