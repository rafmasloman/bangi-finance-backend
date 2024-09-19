import jwt from 'jsonwebtoken';

export const generateToken = (payload: { id: string; role: string }) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error();
  }

  const token = jwt.sign(payload, secretKey, {});

  return token;
};
