import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeadService } from '../services/lead/lead.service';
import { WhatsAppService } from 'src/crosscuting/integration/whatsapp/whatsapp.service';

@Injectable()
export class LeadTaskService {
  constructor(
    private readonly leadService: LeadService,
    private readonly whats: WhatsAppService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'detectTrialEndingsPromotion',
    timeZone: 'America/Sao_Paulo',
  })
  async detectTrialEndingsPromotion() {
    console.log('Running detectTrialEndingsPromotion');
    const results = await this.leadService.getTrialEndingsPromotion();
    console.log(results);

    for (const lead of results) {
      this.whats.sendMessageTemplate(
        lead.phone,
        'trialEndPromotion::invites=' + lead.invitesUsed,
      );
    }
  }
}
