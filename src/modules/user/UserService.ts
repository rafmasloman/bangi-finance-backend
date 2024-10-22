import { CreateUserDTO } from '../../dto/UserDTO';
import { paginationHelper } from '../../helpers/pagination.helper';
import prisma from '../../libs/prisma/orm.libs';
import { generateHashPassword } from '../../libs/security/bcrypt.utils';

class UserService {
  async createUser(params: CreateUserDTO) {
    const {
      email,
      password,
      username,
      role,
      firstname,
      lastname,
      phoneNumber,
    } = params;

    const hashPassword = await generateHashPassword(password);

    try {
      const user = prisma.users.create({
        data: {
          email,
          password: hashPassword,
          username,
          firstname,
          lastname,
          phoneNumber,
          role,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(page?: number, pageSize?: number) {
    try {
      const totalRecords = await prisma.users.count();

      const pagination = paginationHelper(page, pageSize, totalRecords);

      const users = await prisma.users.findMany({
        skip: pagination.skip,
        take: pagination.take,
      });

      return { users, totalPage: pagination.totalPage };
    } catch (error) {
      throw error;
    }
  }

  async getDetailUser(id: string) {
    try {
      const user = await prisma.users.findFirst({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await prisma.users.delete({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
