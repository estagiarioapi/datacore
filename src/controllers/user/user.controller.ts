import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from 'src/applications/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async users() {
    return this.service.users();
  }

  @Get(':phone')
  async user(@Param('phone') phone: string) {
    return this.service.user(phone);
  }

  @Post()
  async createUser(@Body() data: any) {
    return this.service.createUser(data);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.service.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
