import { BadRequestException } from '@nestjs/common';

/**
 * Function to standardize a phone number from Brazil. \
 * Currently this function support all variations of phone numbers. \
 * Including:
 *  - 5511999999999 [OK]
 *  - 011999999999 [Replace 0 by 55]
 *  - 551199999999 [Add 9 after DDD]
 *  - 11999999999 [Add 55 before DDD]
 *  - 55011999999999 [Remove 0 after 55]
 *
 * @remarks Even this function handling numbers with special characters, api uses `class-validator` on DTOs. \
 * So, when sending requests to the api, the phone number must be a string with only numbers, otherwise the validation will fail.
 * @param phone
 * @returns `phone` in international format (55 + DDD + number) without spaces and special characters.
 * @throws `BadRequestException` if the phone number is invalid.
 */
export function standardizeBRPhone(phone: string): string {
  phone = phone.replace(/\D/g, '');
  phone = phone.replace(/^0+/, '');

  if (phone.startsWith('55') && phone.slice(2).startsWith('0')) {
    phone = phone.replace('55', '');
    phone = phone.replace(/^0+/, '');
    phone = `55${phone}`;
  }

  if (phone.length === 11 || phone.length === 10) {
    phone = `55${phone}`;
  }

  if (phone.length === 12 && phone.startsWith('55')) {
    phone = phone.slice(0, 4) + '9' + phone.slice(4);
  }

  if (phone.length !== 13) {
    throw new BadRequestException('Telefone inválido');
  }

  return phone;
}
