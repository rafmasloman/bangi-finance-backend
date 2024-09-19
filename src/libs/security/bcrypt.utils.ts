import bcrypt from 'bcrypt';

export const generateHashPassword = async (password: string) => {
  const hashPassword = await bcrypt.hash(password, 10);

  return hashPassword;
};

export const generateComparePassword = async (
  password: string,
  currentPassword: string,
) => {
  console.log('current : ', currentPassword);
  console.log('password : ', password);

  const comparePassword = await bcrypt.compare(currentPassword, password);

  return comparePassword;
};
