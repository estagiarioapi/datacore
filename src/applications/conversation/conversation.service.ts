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

  async createConversationMessage(data: any) {
    return this.repository.createConversationMessage(data);
  }

  async updateConversation(id: string, data: any) {
    return this.repository.updateConversation({ where: { id }, data });
  }

  async deleteConversation(id: string) {
    return this.repository.deleteConversation({ id });
  }

  async getMessageFromOpenAIApi(thread: string) {
    const resposta = async (thread: string) => {
      const payload = {
        thread: thread,
        tokens: 300,
      };
      const headers = {
        'Content-Type': 'application/json',
      };
      const url =
        'https://eytqilito555ozskhjp2p76auy0wfhtb.lambda-url.us-east-2.on.aws/';

      try {
        const response = await axios.post(url, payload, { headers });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await resposta(thread);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, 3000);
    });
  }
}
