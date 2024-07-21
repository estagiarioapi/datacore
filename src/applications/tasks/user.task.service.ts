import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { WhatsAppService } from '../../crosscuting/integration/whatsapp/whatsapp.service';
import { ConversationService } from '../services/conversation/conversation.service';
import { UserService } from '../services/user/user.service';

@Injectable()
export class UserConversationTaskService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly whats: WhatsAppService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'detectUserInactivity',
    timeZone: 'America/Sao_Paulo',
  })
  async detectUserInactivity(): Promise<void> {
    try {
      const users = await this.userService.users();
      for (const user of users) {
        const openedConversations =
          await this.conversationService.conversationOpened(user.id);
        if (openedConversations.length > 0) {
          const conversationMessages =
            await this.conversationService.getConversationsMessages(
              openedConversations[0].id,
            );
          if (
            conversationMessages.length > 0 &&
            openedConversations[0].threadId
          ) {
            const lastMessage =
              conversationMessages[conversationMessages.length - 1];
            const lastMessageTime = moment(lastMessage.createdAt);
            const currentTime = moment();

            const minutesSinceLastMessage = currentTime.diff(
              lastMessageTime,
              'minutes',
            );
            console.log(minutesSinceLastMessage);

            if (minutesSinceLastMessage >= 59) {
              console.log(
                `User ${user.phone} has been inactive for more than an hour.`,
              );
              return await this.whats.sendTimeoutMessage(user.phone);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to detect user inactivity`, error.stack);
    }
  }
}
