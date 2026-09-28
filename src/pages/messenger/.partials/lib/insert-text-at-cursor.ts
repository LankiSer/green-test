export function insertTextAtCursor(
  element: HTMLTextAreaElement,
  text: string,
  currentValue: string,
): { value: string; cursor: number } {
  const start = element.selectionStart ?? currentValue.length;
  const end = element.selectionEnd ?? currentValue.length;
  const next = currentValue.slice(0, start) + text + currentValue.slice(end);
  const cursor = start + text.length;
  return { value: next, cursor };
}
