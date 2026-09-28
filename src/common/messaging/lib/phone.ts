/** Нормализует номер и формирует chatId для GREEN-API (формат с @c.us). */
export function phoneToChatId(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    digits = `7${digits}`;
  }
  if (!digits) {
    throw new Error('Введите номер телефона');
  }
  return `${digits}@c.us`;
}

export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    const d = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
    return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  }
  return raw.trim() || digits;
}

export function chatIdMatchesPhone(chatId: string, phone: string): boolean {
  try {
    return phoneToChatId(phone) === chatId;
  } catch {
    return false;
  }
}
