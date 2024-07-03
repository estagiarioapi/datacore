import { Module } from '@nestjs/common';
import { ConversationService } from './applications/conversation/conversation.service';
import { UserService } from './applications/user/user.service';
import { ConversationController } from './controllers/conversation/conversation.controller';
import { UserController } from './controllers/user/user.controller';
import { ConversationRepository } from './domains/repositories/conversation.repository';
import { UserRepository } from './domains/repositories/user.repository';
import { PrismaService } from './infra/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [UserController, ConversationController],
  providers: [
    PrismaService,
    UserService,
    UserRepository,
    ConversationRepository,
    ConversationService,
  ],
})
export class AppModule {}
