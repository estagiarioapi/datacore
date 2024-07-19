import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { LeadService } from 'src/applications/services/lead/lead.service';
import { CreateLeadDto } from 'src/domains/dto/createLead.dto';
import { LeadEventService } from '../../applications/events/lead/lead.event.service';

@Controller('lead')
export class LeadController {
  constructor(
    private readonly leadService: LeadService,
    private leadEvent: LeadEventService,
  ) {}

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

  @Put('shiftWaitList/:positions')
  public async shiftWaitList(@Param('positions') positions: number) {
    return await this.leadService.shiftWaitList(positions);
  }

  @Put()
  public async updateLead() {
    return await this.leadEvent.update();
  }
}
