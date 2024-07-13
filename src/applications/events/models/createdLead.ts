export class CreatedLead {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly inviteCode: string;
  readonly invitedByCode?: string;
}
