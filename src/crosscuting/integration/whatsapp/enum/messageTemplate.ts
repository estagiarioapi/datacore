export enum MessageTemplate {
  NoneInvite = 'message01_01',
  OnlyNoneInvite = 'message01',
  SentOneInvite = 'message02',
  SentTwoInvites = 'message03',

  SentOneInviteOnly = 'message03_01',
  SentTwoInviteOnly = 'message02_02',
  SentThreeInvites = 'message04',

  AvailablePosition = 'message05',
  OneInviteSent = 'oneinvitesent',
  TwoInvitesSent = 'twoinvitesent',
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
    default:
      return MessageTemplate.OnlyNoneInvite;
  }
};

export const messageTemplate2HourRemaining = (
  invitesUsed: number,
): MessageTemplate => {
  switch (invitesUsed) {
    case 1:
      return MessageTemplate.SentOneInviteOnly;
    case 2:
      return MessageTemplate.SentTwoInviteOnly;
  }
};

export const messageTemplateInviteSent = (
  invitesUsed: number,
): MessageTemplate => {
  switch (invitesUsed) {
    case 1:
      return MessageTemplate.OneInviteSent;
    case 2:
      return MessageTemplate.TwoInvitesSent;
    case 3:
      return MessageTemplate.SentThreeInvites;
  }
};
