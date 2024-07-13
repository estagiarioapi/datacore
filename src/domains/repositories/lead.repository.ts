import { Lead, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

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
    return this.prisma.lead.findFirst({
      where: {
        inviteCode,
      },
    });
  }

  async getNextWaitListNumber(): Promise<number> {
    const count = await this.prisma.lead.count({
      where: {
        status: 'WAITLIST',
      },
    });

    return count + 1;
  }
}
