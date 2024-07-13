import { Injectable } from '@nestjs/common';
import { LeadStatus, Role } from '@prisma/client';
import { randomStringBiased } from 'src/crosscuting/util/random';
import { CreateLeadDto } from 'src/domains/dto/createLead.dto';
import { LeadRepository } from 'src/domains/repositories/lead.repository';

@Injectable()
export class LeadService {
  constructor(private readonly leadRepository: LeadRepository) {}

  async createLead(data: CreateLeadDto) {
    const userInviteCode = await this.generateInviteCode(
      data.email,
      data.phone,
    );

    if (data.inviteCode) {
      const inviter = await this.leadRepository.findByInviteCode(
        data.inviteCode,
      );

      if (inviter) {
        // do something
      } else {
        // do something
      }
    }

    this.leadRepository.createLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      inviteCode: userInviteCode,
      status: LeadStatus.WAITLIST,
      descriptionRole: this.getRoleDescription(data.role, data.roleDescription),
      waitListNumber: await this.leadRepository.getNextWaitListNumber(),
    });
  }

  async generateInviteCode(email: string, phone: string) {
    return await randomStringBiased(email.concat(phone));
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
