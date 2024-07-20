import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InviteStatus } from '@prisma/client';
import {
  MessageTemplate,
  messageTemplateInviteSent,
} from 'src/crosscuting/integration/whatsapp/enum/messageTemplate';
import { WhatsAppService } from 'src/crosscuting/integration/whatsapp/whatsapp.service';
import { LeadRepository } from 'src/domains/repositories/lead.repository';
import { LeadInviteRepository } from 'src/domains/repositories/leadInvite.repository';
import { CreatedLead } from '../models/createdLead';
import { UpdatedLead } from '../models/updatedLead';
import { Logger } from 'src/crosscuting/decorators/logger';

@Injectable()
export class LeadEventService {
  constructor(
    private readonly whats: WhatsAppService,
    private readonly leadRepository: LeadRepository,
    private readonly leadInviteRepository: LeadInviteRepository,
  ) {}

  @OnEvent('lead.created', { nextTick: true, async: true })
  @Logger()
  private async onLeadCreated(data: CreatedLead) {
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
      createdAt: invitedBy.createdAt,
      invites: leadOriginUpdate.invitesUsed,
      waitListNumber: leadOriginUpdate.waitListNumber,
    });
  }

  @Logger()
  private async onLeadUpdated(data: UpdatedLead) {
    const start = Date.now() - data.createdAt.getTime();
    const hours = Math.floor(start / 36e5);

    const parameters = {
      type: 'body',
      parameters: [
        {
          type: 'text',
          text: 48 - hours,
        },
      ],
    };

    Promise.allSettled([
      this.whats.sendMessageTemplate(
        data.phone,
        messageTemplateInviteSent(data.invites),
        data.invites >= 3 ? null : parameters,
      ),
      this.leadRepository.updateWaitListNumberRange(
        data.id,
        data.waitListNumber,
        10,
      ),
    ]);
  }

  @OnEvent('lead.accepted', { nextTick: true, async: true })
  @Logger()
  private async onLeadAccepted(positions: number) {
    const leads = await this.leadRepository.shiftWaitList(positions);

    Promise.all(
      leads.map((lead) => {
        this.whats.sendMessageTemplate(
          lead.phone,
          MessageTemplate.AvailablePosition,
        );
      }),
    );
  }

  @OnEvent('lead.syncWailist', { nextTick: true, async: true })
  @Logger()
  private async onSyncWaitList(positions: number) {
    this.leadRepository.syncWaitList(positions);
  }
}
