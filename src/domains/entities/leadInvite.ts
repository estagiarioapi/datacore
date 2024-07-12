import { $Enums, LeadInvite as Base } from '@prisma/client';

export class LeadInvite implements Base {
  id: string;
  originLeadId: string;
  destinyLeadId: string;
  inviteCode: string;
  inviteStatus: $Enums.InviteStatus;
  updatedAt: Date;
  createdAt: Date;
}
