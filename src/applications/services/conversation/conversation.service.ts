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
    const resposta = async (thread) => {
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

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkResponse = async () => {
        while (attempts < 10) {
          try {
            const data = await resposta(thread);
            if (data === false) {
              attempts++;
              console.log(
                `Tentativa ${attempts}: Resposta ainda não disponível, tentando novamente...`,
              );
              await delay(5000); // Espera 5 segundos antes de tentar novamente
            } else {
              resolve(data);
              return;
            }
          } catch (error) {
            reject(error);
            return;
          }
        }
        reject(
          new Error(
            'Número máximo de tentativas atingido sem resposta válida.',
          ),
        );
      };

      checkResponse();
    });
  }
}
