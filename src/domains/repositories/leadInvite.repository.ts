import { LeadInvite, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

export class LeadInviteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async leadInvite(
    leadInviteWhereUniqueInput: Prisma.LeadInviteWhereUniqueInput,
  ): Promise<LeadInvite | null> {
    const leadInvite = await this.prisma.leadInvite.findUnique({
      where: leadInviteWhereUniqueInput,
    });
    console.log(leadInvite);
    return leadInvite;
  }

  async leadInvites(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LeadInviteWhereUniqueInput;
    where?: Prisma.LeadInviteWhereInput;
    orderBy?: Prisma.LeadInviteOrderByWithRelationInput;
  }): Promise<LeadInvite[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.leadInvite.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLeadInvite(
    data: Prisma.LeadInviteCreateInput,
  ): Promise<LeadInvite> {
    return this.prisma.leadInvite.create({
      data,
    });
  }

  async updateLeadInvite(params: {
    where: Prisma.LeadInviteWhereUniqueInput;
    data: Prisma.LeadInviteUpdateInput;
  }): Promise<LeadInvite> {
    const { where, data } = params;
    return this.prisma.leadInvite.update({
      data,
      where,
    });
  }

  async deleteLeadInvite(
    where: Prisma.LeadInviteWhereUniqueInput,
  ): Promise<LeadInvite> {
    return this.prisma.leadInvite.delete({
      where,
    });
  }
}
