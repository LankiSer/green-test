const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
const fullFmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatMessageTime(ts: number): string {
  return timeFmt.format(new Date(ts));
}

export function formatThreadTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) return formatMessageTime(ts);
  const weekAgo = now.getTime() - 7 * 86400000;
  if (ts > weekAgo) return dayFmt.format(d).replace('.', '');
  return dayFmt.format(d).replace('.', '');
}

export function formatDateDivider(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) return 'Сегодня';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return 'Вчера';
  return fullFmt.format(d);
}
