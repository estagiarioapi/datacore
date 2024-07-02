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

  @Get(':id')
  async user(@Param('id') id: string) {
    console.log('id', id);

    return this.service.user(id);
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
