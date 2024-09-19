import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO } from '../../dto/UserDTO';
import UserService from './UserService';

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const userDTO = plainToInstance(CreateUserDTO, req.body);
    const error = await validate(userDTO);

    // const {
    //   email,
    //   password,
    //   role,
    //   username,
    //   firstname,
    //   lastname,
    //   phoneNumber,
    // } = req.body;

    if (error.length > 0) {
      next(error);
    }

    const {
      email,
      password,
      role,
      username,
      firstname,
      lastname,
      phoneNumber,
    } = userDTO;
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
      throw error;
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();

      return res.json({
        statusCode: 200,
        message: 'Success Get All Users Data',
        data: users,
      });
    } catch (error) {
      console.log('error : ', error);

      throw error;
    }
  }
}

export default UserController;
