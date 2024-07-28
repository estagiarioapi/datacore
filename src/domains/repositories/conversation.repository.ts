import { Injectable } from '@nestjs/common';
import {
  Conversation,
  ConversationMessage,
  Message,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async conversation(
    conversationWhereUniqueInput: Prisma.ConversationWhereUniqueInput,
  ): Promise<Conversation | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: conversationWhereUniqueInput,
    });
    console.log(conversation);
    return conversation;
  }

  async conversations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ConversationWhereUniqueInput;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput;
  }): Promise<Conversation[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.conversation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async allConversations(id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        userId: id,
      },
      include: {
        conversationMessages: {
          include: {
            message: true,
          },
        },
      },
    });
  }

  async createConversation(
    data: Prisma.ConversationCreateInput,
  ): Promise<Conversation> {
    return this.prisma.conversation.create({
      data,
    });
  }

  async createConversationMessage(
    data: Prisma.ConversationMessageCreateInput,
  ): Promise<ConversationMessage> {
    return this.prisma.conversationMessage.create({
      data,
    });
  }

  async getConversationMessage(id: string) {
    return this.prisma.conversationMessage.findMany({
      where: {
        conversationId: id,
      },
      include: {
        message: true,
      },
    });
  }

  async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({
      data,
    });
  }

  async updateConversation(params: {
    where: Prisma.ConversationWhereUniqueInput;
    data: Prisma.ConversationUpdateInput;
  }): Promise<Conversation> {
    const { where, data } = params;
    return this.prisma.conversation.update({
      data,
      where,
    });
  }

  async deleteConversation(
    where: Prisma.ConversationWhereUniqueInput,
  ): Promise<Conversation> {
    return this.prisma.conversation.delete({
      where,
    });
  }
}
