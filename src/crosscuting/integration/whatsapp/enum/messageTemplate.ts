export enum MessageTemplate {
  OnlyNoneInvite = 'message01',
  SentOneInvite = 'message02',
  SentOneInviteOnly = 'message02_1',
  SentOneInviteTwo = 'message02_2',
  SentTwoInvites = 'message03',
  SentThreeInvites = 'message04',
}

export const messageTemplate24HourRemaining = (
  invitesUsed: number,
): MessageTemplate => {
  switch (invitesUsed) {
    case 0:
      return MessageTemplate.OnlyNoneInvite;
    case 1:
      return MessageTemplate.SentOneInvite;
    case 2:
      return MessageTemplate.SentTwoInvites;
    case 3:
      return MessageTemplate.SentThreeInvites;
    default:
      return MessageTemplate.OnlyNoneInvite;
  }
};

export const messageTemplate2HourRemaining = (
  invitesUsed: number,
): MessageTemplate => {
  switch (invitesUsed) {
    case 0:
      return MessageTemplate.OnlyNoneInvite;
    case 1:
      return MessageTemplate.SentOneInviteOnly;
    case 2:
      return MessageTemplate.SentOneInviteTwo;
    case 3:
      return MessageTemplate.SentThreeInvites;
    default:
      return MessageTemplate.OnlyNoneInvite;
  }
};
