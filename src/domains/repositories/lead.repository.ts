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
    const now = new Date();
    const start = new Date(now.getTime() - 46 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - 44 * 60 * 60 * 1000);

    return this.prisma.lead.findMany({
      where: {
        status: 'WAITLIST',
        invitesUsed: {
          gte: 1,
          lte: 2,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async get24HoursEndingsPromotion(): Promise<Lead[]> {
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - 22 * 60 * 60 * 1000);

    return this.prisma.lead.findMany({
      where: {
        status: 'WAITLIST',
        invitesUsed: {
          gte: 0,
          lte: 2,
        },
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
      select: {
        id: true,
        phone: true,
      },
    });

    await this.prisma.lead.updateMany({
      where: {
        id: {
          in: leads.map((lead) => lead.id),
        },
      },
      data: {
        waitListNumber: 99,
        status: 'ACCEPTED',
      },
    });

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

  async updateWaitListNumber(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const leads = await tx.lead.findMany({
        orderBy: [{ invitesUsed: 'desc' }, { createdAt: 'asc' }],
        where: {
          status: 'WAITLIST',
        },
      });

      const min = Math.min(...leads.map((lead) => lead.waitListNumber));
      const updates = leads.map((lead, index) => ({
        id: lead.id,
        waitListNumber: min + index,
      }));

      await Promise.all(
        updates.map((update) =>
          tx.lead.update({
            where: { id: update.id },
            data: { waitListNumber: update.waitListNumber },
          }),
        ),
      );
    });
  }

  async updateWaitListNumberRange(
    id: string,
    waitListNumber: number,
    range: number,
  ) {
    const neighbors = await this.prisma.lead.findMany({
      where: {
        OR: [
          {
            id: {
              equals: id,
            },
          },
          {
            status: {
              equals: 'WAITLIST',
            },
            waitListNumber: {
              lte: waitListNumber + range,
            },
          },
        ],
      },
      orderBy: [{ invitesUsed: 'desc' }, { createdAt: 'asc' }],
      take: range,
    });

    const min = Math.min(...neighbors.map((lead) => lead.waitListNumber));
    const updates = neighbors.map((lead, index) => ({
      id: lead.id,
      name: lead.name,
      invites: lead.invitesUsed,
      createdAt: lead.createdAt,
      waitListNumber: min + index,
    }));

    await this.prisma.$transaction(
      updates.map((update) =>
        this.prisma.lead.update({
          where: { id: update.id },
          data: { waitListNumber: update.waitListNumber },
        }),
      ),
    );
  }
}
