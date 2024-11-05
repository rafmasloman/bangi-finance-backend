import { CreateUserDTO, UpdateUserDTO } from '../../dto/UserDTO';
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
      const users = await prisma.users.findMany();

      return users;
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

  async updateUser(id: string, payload: UpdateUserDTO) {
    try {
      if (!!payload.password) {
        const hashPassword = await generateHashPassword(payload.password);

        const user = await prisma.users.update({
          where: {
            id,
          },
          data: {
            email: payload.email,
            username: payload.username,
            firstname: payload.firstname,
            lastname: payload.lastname,
            phoneNumber: payload.phoneNumber,
            role: payload.role,
            password: hashPassword,
          },
        });

        return user;
      } else {
        const user = await prisma.users.update({
          where: {
            id,
          },
          data: {
            email: payload.email,
            username: payload.username,
            firstname: payload.firstname,
            lastname: payload.lastname,
            phoneNumber: payload.phoneNumber,
            role: payload.role,
          },
        });

        return user;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
