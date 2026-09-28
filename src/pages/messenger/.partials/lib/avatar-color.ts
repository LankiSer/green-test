const PALETTE = [
  '#2481cc',
  '#e17076',
  '#7bc862',
  '#e5ca77',
  '#65aadd',
  '#a695e7',
  '#ee7aae',
  '#6ec9cb',
];

export function avatarColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
