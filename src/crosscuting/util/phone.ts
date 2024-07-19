export function standardizeBRPhone(phone: string): string {
  // Remover todos os caracteres que não sejam números
  phone = phone.replace(/\D/g, '');

  // Adicionar DDI se o número tiver 10 ou 11 dígitos
  if (phone.length === 11 || phone.length === 10) {
    phone = `55${phone}`;
  }

  // Corrigir números de 12 dígitos começando com 55
  if (phone.length === 12 && phone.startsWith('55')) {
    const fourthChar = phone.charAt(4);
    phone = phone.replace(fourthChar, '9');
  }

  // Certificar-se de que o número final tenha 13 dígitos
  if (phone.length !== 13) {
    throw new Error('Número de telefone inválido');
  }

  return phone;
}
