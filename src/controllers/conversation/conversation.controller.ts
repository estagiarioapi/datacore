import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ConversationService } from 'src/applications/conversation/conversation.service';

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
}
