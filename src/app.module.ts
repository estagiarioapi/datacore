import { Module } from '@nestjs/common';
import { ConversationService } from './applications/services/conversation/conversation.service';
import { UserService } from './applications/services/user/user.service';
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
import { LeadService } from './applications/services/lead/lead.service';
import { LeadRepository } from './domains/repositories/lead.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LeadEventService } from './applications/events/lead/lead.event.service';
import { LeadInviteRepository } from './domains/repositories/leadInvite.repository';
import { LeadInviteService } from './applications/services/lead/lead-invite.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LeadTaskService } from './applications/tasks/lead.task.service';
import { WhatsAppService } from './crosscuting/integration/whatsapp/whatsapp.service';

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
  ],
})
export class AppModule {}
