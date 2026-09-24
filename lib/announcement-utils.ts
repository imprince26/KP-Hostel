/**
 * Utility functions for safely handling announcement and notification content.
 * Prevents HTML string leakage, unclosed tags, and provides clean text excerpts.
 */

/**
 * Strips all HTML tags from a string and decodes common HTML entities.
 */
export function stripHtml(input: string | null | undefined): string {
  if (!input) return "";

  // Replace common block elements with a space before stripping to avoid mashed words
  let text = input
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Normalize excessive whitespace
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Creates a clean text excerpt from HTML content without broken tags.
 */
export function createExcerpt(htmlContent: string | null | undefined, maxLength: number = 160): string {
  const plainText = stripHtml(htmlContent);
  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  
  // Cut cleanly at word boundary if possible
  const cut = plainText.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) {
    return cut.slice(0, lastSpace) + "...";
  }
  return cut + "...";
}

/**
 * Checks whether a given string contains HTML tags.
 */
export function containsHtml(input: string | null | undefined): boolean {
  if (!input) return false;
  return /<[a-z][\s\S]*>/i.test(input);
}
