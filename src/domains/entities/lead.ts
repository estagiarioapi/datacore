import { $Enums, Lead as Base } from '@prisma/client';

export class Lead implements Base {
  id: string;
  name: string;
  email: string;
  phone: string;
  inviteCode: string;
  role: $Enums.Role;
  descriptionRole: string;
  invitesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}
