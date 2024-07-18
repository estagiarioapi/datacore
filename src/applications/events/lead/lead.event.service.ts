import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LeadRepository } from 'src/domains/repositories/lead.repository';
import { LeadInviteRepository } from 'src/domains/repositories/leadInvite.repository';
import { CreatedLead } from '../models/createdLead';
import { InviteStatus } from '@prisma/client';
import { UpdatedLead } from '../models/updatedLead';
import { WhatsAppService } from 'src/crosscuting/integration/whatsapp/whatsapp.service';
import {
  MessageTemplate,
  messageTemplate2HourRemaining,
} from 'src/crosscuting/integration/whatsapp/enum/messageTemplate';

@Injectable()
export class LeadEventService {
  constructor(
    private readonly whats: WhatsAppService,
    private readonly leadRepository: LeadRepository,
    private readonly leadInviteRepository: LeadInviteRepository,
  ) {}

  @OnEvent('lead.created', { nextTick: true, async: true })
  private async onLeadCreated(data: CreatedLead) {
    console.log('leadCreated', data);

    if (!data.invitedByCode) {
      return;
    }

    const invitedBy = await this.leadRepository.findByInviteCode(
      data.invitedByCode,
    );

    if (!invitedBy || invitedBy.invitesUsed >= 3) {
      return;
    }

    await this.leadInviteRepository.createLeadInvite({
      inviteCode: data.invitedByCode,
      inviteStatus: InviteStatus.ACCEPTED,
      destinyLead: {
        connect: {
          id: data.id,
        },
      },
      originLead: {
        connect: {
          id: invitedBy.id,
        },
      },
    });

    const leadOriginUpdate = await this.leadRepository.updateLead({
      where: { id: invitedBy.id },
      data: {
        invitesUsed: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
    });

    this.onLeadUpdated({
      id: invitedBy.id,
      name: invitedBy.name,
      email: invitedBy.email,
      phone: invitedBy.phone,
      invites: leadOriginUpdate.invitesUsed,
    });
  }

  private async onLeadUpdated(data: UpdatedLead) {
    // lead updated logic
    // send a message saying that his invite was used
    // and that his position in the waitlist has changed
    console.log('leadUpdated', data);
    this.whats.sendMessageTemplate(
      data.phone,
      messageTemplate2HourRemaining(data.invites),
    );
  }

  @OnEvent('lead.accepted', { nextTick: true, async: true })
  private async onLeadAccepted(data: CreatedLead[]) {
    for (const lead of data) {
      this.whats.sendMessageTemplate(
        lead.phone,
        MessageTemplate.AvailablePosition,
      );
    }
  }

  @OnEvent('lead.syncWailist', { nextTick: true, async: true })
  private async onLeadRejected(positions: number) {
    this.leadRepository.syncWaitList(positions);
  }
}
