import { User } from './src/auth/user.entity/user.entity';

declare module 'express' {
  interface Request {
    user: User;
  }
}