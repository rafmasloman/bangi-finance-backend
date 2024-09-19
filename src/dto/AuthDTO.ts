export class RegisterDTO {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string;
}

export class LoginDTO {
  email: string;
  password: string;
}
