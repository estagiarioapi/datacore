import { Body, Controller, Param, Post, Get, Put } from '@nestjs/common';
import { LeadService } from 'src/applications/services/lead/lead.service';
import { CreateLeadDto } from 'src/domains/dto/createLead.dto';

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('create')
  public async createLead(@Body() dto: CreateLeadDto) {
    return await this.leadService.createLead(dto);
  }

  @Get('AuthorizedPhone/:phone')
  public async AuthorizedPhone(@Param('phone') phone: string) {
    return await this.leadService.isPhoneAuthorized(phone);
  }

  @Put('acceptSendInvite/:phone')
  public async acceptSendInvite(@Param('phone') phone: string) {
    return await this.leadService.acceptSendInvite(phone);
  }
}
