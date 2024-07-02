import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { PrismaService } from './infra/prisma/prisma.service';
import { UserService } from './applications/user/user.service';
import { UserRepository } from './domains/repositories/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository],
})
export class AppModule {}
