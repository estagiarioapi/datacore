export function standardizeBRPhone(phone: string): string {
  return phone.length === 11 ? `55${phone}` : phone;
}
