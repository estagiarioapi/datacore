import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LeadStatus, Role } from '@prisma/client';
import { CreatedLead } from 'src/applications/events/models/createdLead';
import { standardizeBRPhone } from 'src/crosscuting/util/phone';
import { randomStringBiased } from 'src/crosscuting/util/random';
import { CreateLeadDto } from 'src/domains/dto/createLead.dto';
import { LeadRepository } from 'src/domains/repositories/lead.repository';

@Injectable()
export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createLead(data: CreateLeadDto) {
    const validationUniqueness = await Promise.all([
      this.leadRepository.findByEmail(data.email),
      this.leadRepository.findByPhone(standardizeBRPhone(data.phone)),
    ]);

    if (validationUniqueness.some(Boolean)) {
      throw new BadRequestException('Email ou telefone já cadastrado!');
    }

    const lead = {
      role: data.role,
      name: data.name,
      email: data.email,
      phone: standardizeBRPhone(data.phone),
      status: LeadStatus.WAITLIST,
      waitListNumber: await this.leadRepository.getNextWaitListNumber(),
      inviteCode: await this.generateInviteCode(data.email, data.phone),
      descriptionRole: this.getRoleDescription(data.role, data.roleDescription),
    };

    const saved = await this.leadRepository.createLead(lead);

    this.eventEmitter.emit('lead.created', {
      id: saved.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      inviteCode: lead.inviteCode,
      invitedByCode: data.inviteByCode,
    } as CreatedLead);

    return lead.inviteCode;
  }

  async generateInviteCode(email: string, phone: string) {
    const codeRaw = email.concat(phone);
    while (true) {
      const code = await randomStringBiased(codeRaw);
      const valid = await this.leadRepository.validCode(code);

      if (valid) {
        return code;
      }
    }
  }

  async isPhoneAuthorized(phone: string) {
    return await this.leadRepository.findByPhone(phone);
  }

  async get2HoursEndingsPromotion() {
    return await this.leadRepository.get2HoursEndingsPromotion();
  }

  async get24HoursEndingsPromotion() {
    return await this.leadRepository.get24HoursEndingsPromotion();
  }

  async acceptSendInvite(phone: string) {
    return await this.leadRepository.updateLead({
      where: { phone: standardizeBRPhone(phone) },
      data: { acceptInvite: true },
    });
  }

  async shiftWaitList(positions: number) {
    const leads = await this.leadRepository.shiftWaitList(positions);

    this.eventEmitter.emit('lead.accepted', leads);
    this.eventEmitter.emit('lead.syncWailist', positions);

    return leads.map((lead) => ({
      phone: lead.phone,
      name: lead.name,
      invited: lead.invitesUsed,
    }));
  }

  private getRoleDescription(role: Role, roleDescription: string) {
    if (role === Role.LAWYER) {
      return 'Advogado';
    } else if (role === Role.STUDENT) {
      return 'Estudante';
    } else {
      return roleDescription;
    }
  }
}
