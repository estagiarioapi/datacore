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
    return await this.leadRepository.findByPhone(standardizeBRPhone(phone));
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
    this.eventEmitter.emit('lead.accepted', positions);
    this.eventEmitter.emit('lead.syncWailist', positions);
    return { message: 'Lista de espera em processamento!', positions };
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

  async update() {
    return await this.leadRepository.updateLead({
      where: { id: '2b124d8b-d27d-43de-b84c-588abaa6ef5e' },
      data: { phone: '554398482484' },
    });
  }

  async updateWaitListNumber() {
    return await this.leadRepository.updateWaitListNumber();
  }

  async updateWaitListNumberId(id: string) {
    const lead = await this.leadRepository.lead({ id });
    return await this.leadRepository.updateWaitListNumberRange(
      lead.id,
      lead.waitListNumber,
      10,
    );
  }
}
