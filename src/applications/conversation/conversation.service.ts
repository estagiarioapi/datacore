import { Injectable } from '@nestjs/common';
import { ConversationRepository } from 'src/domains/repositories/conversation.repository';

@Injectable()
export class ConversationService {
  constructor(private readonly repository: ConversationRepository) {}

  async conversation(id: string) {
    return this.repository.conversation({ id });
  }

  async conversations() {
    return this.repository.conversations({});
  }

  async createConversation(data: any) {
    return this.repository.createConversation(data);
  }

  async updateConversation(id: string, data: any) {
    return this.repository.updateConversation({ where: { id }, data });
  }

  async deleteConversation(id: string) {
    return this.repository.deleteConversation({ id });
  }
}
