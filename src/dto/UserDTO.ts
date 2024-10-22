// import { Role } from '@prisma/client';
// import {
//   IsEmail,
//   IsEnum,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// // export interface CreateUserDTO {
// //   email: string;
// //   password: string;
// //   username: string;
// //   role: Role;
// // }

// // export interface UpdateUserDTO {
// //   email?: string;
// //   password?: string;
// //   username?: string;
// //   role?: Role;
// // }

// export class CreateUserDTO {
//   @IsEmail()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   @IsString()
//   @IsNotEmpty()
//   username: string;

//   @IsString()
//   @IsNotEmpty()
//   firstname: string;

//   @IsString()
//   @IsNotEmpty()
//   lastname: string;

//   @IsString()
//   @IsOptional()
//   phoneNumber: string;

//   @IsEnum(Role)
//   role: Role;
// }

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'EMPLOYEE';
  username: string;
}
