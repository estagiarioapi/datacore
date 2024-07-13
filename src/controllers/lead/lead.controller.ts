import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LeadService } from 'src/applications/lead/lead.service';
import { CreateLeadDto } from 'src/domains/dto/createLead.dto';

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('create')
  public async createLead(@Body() dto: CreateLeadDto) {
    return await this.leadService.createLead(dto);
  }

  @Get('generate-invite-code')
  public async generateInviteCode(
    @Query('email') email: string,
    @Query('phone') phone: string,
  ) {
    return await this.leadService.generateInviteCode(email, phone);
  }
}
