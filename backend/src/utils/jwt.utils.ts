import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

export const generateToken = (payload: { id: string; role: UserRole; email: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    // Cast to any is justified here because the jsonwebtoken library's proprietary StringValue type
    // represents timespans like '7d', which strict TypeScript compiler sees as a generic string.
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
  });
};
