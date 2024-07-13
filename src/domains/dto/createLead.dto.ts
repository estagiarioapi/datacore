import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  readonly phone: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;

  @IsString()
  readonly roleDescription?: string;

  @IsString()
  readonly inviteCode?: string;
}
