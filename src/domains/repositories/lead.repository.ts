import { Injectable } from '@nestjs/common';
import { Lead, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async lead(
    leadWhereUniqueInput: Prisma.LeadWhereUniqueInput,
  ): Promise<Lead | null> {
    const lead = await this.prisma.lead.findUnique({
      where: leadWhereUniqueInput,
    });
    console.log(lead);
    return lead;
  }

  async leads(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LeadWhereUniqueInput;
    where?: Prisma.LeadWhereInput;
    orderBy?: Prisma.LeadOrderByWithRelationInput;
  }): Promise<Lead[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.lead.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLead(data: Prisma.LeadCreateInput): Promise<Lead> {
    return this.prisma.lead.create({
      data,
    });
  }

  async updateLead(params: {
    where: Prisma.LeadWhereUniqueInput;
    data: Prisma.LeadUpdateInput;
  }): Promise<Lead> {
    const { where, data } = params;
    return this.prisma.lead.update({
      data,
      where,
    });
  }

  async deleteLead(where: Prisma.LeadWhereUniqueInput): Promise<Lead> {
    return this.prisma.lead.delete({
      where,
    });
  }

  async findByInviteCode(inviteCode: string): Promise<Lead | null> {
    return this.prisma.lead.findUnique({
      where: {
        inviteCode,
      },
    });
  }

  async validCode(code: string): Promise<boolean> {
    return (
      (await this.prisma.lead.count({
        where: {
          inviteCode: code,
        },
      })) === 0
    );
  }

  /**
   * @remarks every number generated is above 100
   * @returns the next waitlist number
   */
  async getNextWaitListNumber(): Promise<number> {
    const count = await this.prisma.lead.count({
      where: {
        status: 'WAITLIST',
      },
    });

    return count > 0 ? count + 100 : 100;
  }

  async findByEmail(email: string): Promise<Lead | null> {
    return this.prisma.lead.findUnique({
      where: {
        email,
      },
    });
  }

  async findByPhone(phone: string): Promise<Lead | null> {
    return this.prisma.lead.findUnique({
      where: {
        phone,
      },
    });
  }

  async get2HoursEndingsPromotion(): Promise<Lead[]> {
    const [start, end] = [
      new Date(new Date().getTime() - 2.2 * 60 * 60 * 1000),
      new Date(new Date().getTime() + 10 * 60 * 1000),
    ];

    return this.prisma.lead.findMany({
      where: {
        status: 'WAITLIST',
        invitesUsed: {
          gte: 1,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async get24HoursEndingsPromotion(): Promise<Lead[]> {
    const [start, end] = [
      new Date(new Date().getTime() - 24.2 * 60 * 60 * 1000),
      new Date(new Date().getTime() - 22 * 60 * 60 * 1000),
    ];

    return this.prisma.lead.findMany({
      where: {
        status: 'WAITLIST',
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async shiftWaitList(positions: number) {
    const leads = await this.prisma.lead.findMany({
      where: {
        status: 'WAITLIST',
      },
      orderBy: {
        waitListNumber: 'asc',
      },
      take: positions,
    });

    for (let lead of leads) {
      lead = await this.prisma.lead.update({
        where: {
          id: lead.id,
        },
        data: {
          waitListNumber: 99,
          status: 'ACCEPTED',
        },
      });
    }

    return leads;
  }

  async syncWaitList(positions: number) {
    await this.prisma.lead.updateMany({
      where: {
        status: 'WAITLIST',
      },
      data: {
        waitListNumber: {
          decrement: positions,
        },
      },
    });
  }

  async swapWaitList(leadId: string, waitListNumber: number) {
    return this.prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        waitListNumber,
      },
    });
  }
}
