import { User as UserBase } from '@prisma/client';

export class User implements UserBase {
  id: string;
  name: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
