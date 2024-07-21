import { Injectable } from '@nestjs/common';
import axios from 'axios';
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

  async conversationOpened(id: string) {
    return this.repository.conversations({
      where: {
        AND: {
          userId: id,
          isActive: true,
        },
      },
    });
  }

  async createConversation(data: any) {
    return this.repository.createConversation(data);
  }

  async createMessage(data: any) {
    return this.repository.createMessage(data);
  }

  async createConversationMessage(data: any) {
    return this.repository.createConversationMessage(data);
  }

  async getConversationsMessages(id: string) {
    return this.repository.getConversationMessage(id);
  }

  async updateConversation(id: string, data: any) {
    return this.repository.updateConversation({ where: { id }, data });
  }

  async deleteConversation(id: string) {
    return this.repository.deleteConversation({ id });
  }

  async getMessageFromOpenAIApi(thread) {
    const payload = {
      thread: thread,
      tokens: 300,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    const url =
      'https://eytqilito555ozskhjp2p76auy0wfhtb.lambda-url.us-east-2.on.aws/';

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempts = 0; attempts < 3; attempts++) {
      try {
        const response = await axios.post(url, payload, { headers });
        console.log(response.data);
        if (response.data !== false) {
          return response.data;
        } else {
          console.log(
            `Attempt ${attempts + 1}: Response not available, retrying...`,
          );
          if (attempts < 2) {
            await delay(5000);
          }
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    throw new Error(
      'Maximum number of attempts reached without a valid response.',
    );
  }
}
