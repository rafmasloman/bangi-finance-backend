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
    const { email, password } = params;

    try {
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error();
      }

      const compareData = await generateComparePassword(
        user?.password,
        password,
      );
      console.log(compareData);

      if (!compareData) {
        throw new Error();
      }

      const token = generateToken({ id: user.id, role: user.role });

      return { token };
    } catch (error) {
      console.log('error : ', error);

      throw error;
    }
  }
}

export default AuthService;
