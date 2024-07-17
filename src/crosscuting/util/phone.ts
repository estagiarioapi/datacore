export function standardizeBRPhone(phone: string): string {
  let standard =
    phone.length === 11 || phone.length == 10 ? `55${phone}` : phone;

  if (standard.length === 12 && standard.startsWith('55')) {
    const split = standard.split(standard.at(4));
    standard = split[0].concat('99') + split.slice(1).join('');
  }

  return standard;
}
