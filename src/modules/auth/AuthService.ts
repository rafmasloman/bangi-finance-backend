import { error } from 'console';
import { LoginDTO, RegisterDTO } from '../../dto/AuthDTO';
import prisma from '../../libs/prisma/orm.libs';
import {
  generateComparePassword,
  generateHashPassword,
} from '../../libs/security/bcrypt.utils';
import { generateToken } from '../../libs/security/jwt.utils';

class AuthService {
  async register(params: RegisterDTO) {
    const { email, password, username, firstname, lastname, phoneNumber } =
      params;

    try {
      const hashPassword = await generateHashPassword(password);

      const auth = prisma.users.create({
        data: {
          email,
          password: hashPassword,
          username,
          firstname,
          lastname,
          phoneNumber,
          role: 'EMPLOYEE',
        },
      });

      return auth;
    } catch (error) {
      throw error;
    }
  }

  async login(params: LoginDTO) {
    const { email, password, username } = params;

    try {
      const user = await prisma.users.findFirst({
        where: {
          username,
        },
      });

      // if (!user) {
      //   console.log('error');

      //   throw new Error();
      // }

      const compareData = await generateComparePassword(
        user?.password ?? '',
        password,
      );

      if (!compareData) {
        throw new Error();
      }

      const token = generateToken({
        id: user?.id ?? '',
        role: user?.role ?? '',
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async userCredential(id: string) {
    try {
      const credential = await prisma.users.findUnique({
        where: {
          id,
        },
      });

      if (!credential) {
        throw error;
      }

      return credential;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId: string, newPassword: string) {
    try {
      const hashedNewPassword = await generateHashPassword(newPassword);

      const user = await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
