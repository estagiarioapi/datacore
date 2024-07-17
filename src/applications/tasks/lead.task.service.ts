import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeadService } from '../services/lead/lead.service';
import { WhatsAppService } from 'src/crosscuting/integration/whatsapp/whatsapp.service';
import {
  messageTemplate24HourRemaining,
  messageTemplate2HourRemaining,
} from 'src/crosscuting/integration/whatsapp/enum/messageTemplate';
import { Logger } from 'src/crosscuting/decorators/logger';

@Injectable()
export class LeadTaskService {
  constructor(
    private readonly leadService: LeadService,
    private readonly whats: WhatsAppService,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS, {
    name: 'detectTrialEndingsPromotion',
    timeZone: 'America/Sao_Paulo',
  })
  @Logger()
  async detect2HourEndingsPromotion() {
    const results = await this.leadService.get2HoursEndingsPromotion();
    for (const lead of results) {
      this.whats.sendMessageTemplate(
        lead.phone,
        messageTemplate2HourRemaining(lead.invitesUsed),
      );
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS, {
    name: 'detectTrialEndings',
    timeZone: 'America/Sao_Paulo',
  })
  @Logger()
  async detectTrialEndings() {
    const results = await this.leadService.get24HoursEndingsPromotion();
    for (const lead of results) {
      this.whats.sendMessageTemplate(
        lead.phone,
        messageTemplate24HourRemaining(lead.invitesUsed),
      );
    }
  }
}
