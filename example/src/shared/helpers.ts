/**
 * Formats a string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
} 