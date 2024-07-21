import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LeadEventService } from './applications/events/lead/lead.event.service';
import { ConversationService } from './applications/services/conversation/conversation.service';
import { LeadInviteService } from './applications/services/lead/lead-invite.service';
import { LeadService } from './applications/services/lead/lead.service';
import { UserService } from './applications/services/user/user.service';
import { LeadTaskService } from './applications/tasks/lead.task.service';
import { UserConversationTaskService } from './applications/tasks/user.task.service';
import { ConversationController } from './controllers/conversation/conversation.controller';
import { LeadController } from './controllers/lead/lead.controller';
import { UserController } from './controllers/user/user.controller';
import { WhatsAppService } from './crosscuting/integration/whatsapp/whatsapp.service';
import { ConversationRepository } from './domains/repositories/conversation.repository';
import { LeadRepository } from './domains/repositories/lead.repository';
import { LeadInviteRepository } from './domains/repositories/leadInvite.repository';
import { UserRepository } from './domains/repositories/user.repository';
import configuration, {
  isProduction,
} from './infra/configuration/configuration';
import { PrismaService } from './infra/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${isProduction() ? `` : '.development'}`,
      load: [configuration],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
    }),
    ScheduleModule.forRoot({
      cronJobs: true,
    }),
  ],
  controllers: [UserController, ConversationController, LeadController],
  providers: [
    PrismaService,
    UserService,
    UserRepository,
    ConversationRepository,
    ConversationService,
    LeadRepository,
    LeadService,
    LeadInviteRepository,
    LeadInviteService,
    LeadEventService,
    LeadTaskService,
    WhatsAppService,
    UserConversationTaskService,
  ],
})
export class AppModule {}
