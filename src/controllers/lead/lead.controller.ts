import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LeadService } from 'src/applications/services/lead/lead.service';
import { CreateLeadDto } from 'src/domains/dto/createLead.dto';

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('create')
  public async createLead(@Body() dto: CreateLeadDto) {
    return await this.leadService.createLead(dto);
  }

  @Get('authorizedPhone/:phone')
  public async AuthorizedPhone(@Param('phone') phone: string) {
    return await this.leadService.isPhoneAuthorized(phone);
  }

  @Put('acceptSendInvite/:phone')
  public async acceptSendInvite(@Param('phone') phone: string) {
    return await this.leadService.acceptSendInvite(phone);
  }

  @Put('shiftWaitList/:positions')
  public async shiftWaitList(
    @Param('positions', ParseIntPipe) positions: number,
  ) {
    return await this.leadService.shiftWaitList(positions);
  }

  @Put()
  public async updateLead() {
    return await this.leadService.update();
  }

  @Put('updateWaitList')
  public async updateWaitList() {
    return await this.leadService.updateWaitListNumber();
  }

  @Put('updateWaitListNumber/:id')
  public async updateWaitListNumber(
    @Param('id', ParseUUIDPipe) number: string,
  ) {
    return await this.leadService.updateWaitListNumberId(number);
  }
}
