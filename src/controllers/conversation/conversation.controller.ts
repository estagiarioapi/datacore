import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ConversationService } from 'src/applications/services/conversation/conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Get()
  async conversations() {
    return this.service.conversations();
  }

  @Get(':id')
  async conversation(@Param('id') id: string) {
    return this.service.conversation(id);
  }

  @Get('opened/:id')
  async conversationOpened(@Param('id') id: string) {
    return this.service.conversationOpened(id);
  }

  @Post()
  async createConversation(@Body() data: any) {
    return this.service.createConversation(data);
  }

  @Put(':id')
  async updateConversation(@Param('id') id: string, @Body() data: any) {
    return this.service.updateConversation(id, data);
  }

  @Delete(':id')
  async deleteConversation(@Param('id') id: string) {
    return this.service.deleteConversation(id);
  }

  @Post('conversation-message')
  async createConversationMessage(@Body() data: any) {
    return await this.service.createConversationMessage(data);
  }

  @Post('message')
  async createMessage(@Body() data: any) {
    return await this.service.createMessage(data);
  }

  @Get('conversation-message/:id')
  async getConversationMessage(@Param('id') id: string) {
    return await this.service.getConversationsMessages(id);
  }

  @Get('user/:id')
  async getUserConversation(@Param('id') id: string) {
    return await this.service.userConversationOpened(id);
  }

  @Get('messages/user/:id')
  async getUserConversationMessages(@Param('id') id: string) {
    return await this.service.allConversationsMessagesFromUser(id);
  }

  @Get('message/:thread')
  async getMessageFromOpenAI(@Param('thread') thread: string) {
    return await this.service.getMessageFromOpenAIApi(thread);
  }
}
