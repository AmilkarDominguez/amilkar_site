export function formatDate(date: Date, locale = 'es-ES'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date, locale = 'es-ES'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
  });
}
