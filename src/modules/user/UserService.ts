import { CreateUserDTO } from '../../dto/UserDTO';
import prisma from '../../libs/prisma/orm.libs';

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

    try {
      const user = prisma.users.create({
        data: {
          email,
          password,
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

  async getAllUsers() {
    try {
      const users = await prisma.users.findMany();

      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
