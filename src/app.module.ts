import { Module } from '@nestjs/common';
import { ConversationService } from './applications/conversation/conversation.service';
import { UserService } from './applications/user/user.service';
import { ConversationController } from './controllers/conversation/conversation.controller';
import { UserController } from './controllers/user/user.controller';
import { ConversationRepository } from './domains/repositories/conversation.repository';
import { UserRepository } from './domains/repositories/user.repository';
import { PrismaService } from './infra/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import configuration, {
  isProduction,
} from './infra/configuration/configuration';
import { LeadController } from './controllers/lead/lead.controller';
import { LeadService } from './applications/lead/lead.service';
import { LeadRepository } from './domains/repositories/lead.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${isProduction() ? `` : '.development'}`,
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [UserController, ConversationController, LeadController],
  providers: [
    PrismaService,
    UserService,
    UserRepository,
    ConversationRepository,
    ConversationService,
    LeadService,
    LeadRepository,
  ],
})
export class AppModule {}
