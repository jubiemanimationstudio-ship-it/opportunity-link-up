import sanitize from "sanitize-html";
import { marked } from "marked";

// Configure marked to only produce safe HTML
marked.setOptions({
  breaks: true,
  gfm: true
});

// Strip all HTML — used for plain-text fields (title, excerpt, etc.)
export function stripHtml(input: string): string {
  if (!input) return "";
  return sanitize(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

// Sanitize HTML content — used for the rich content field
// Allows safe formatting tags but strips scripts, iframes, event handlers
export function sanitizeContent(html: string): string {
  if (!html) return "";
  return sanitize(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "strong", "em", "b", "i", "u", "s", "mark",
      "ul", "ol", "li",
      "a", "img",
      "blockquote", "pre", "code",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "details", "summary"
    ],
    allowedAttributes: {
      "a": ["href", "title", "target", "rel"],
      "img": ["src", "alt", "width", "height", "loading"],
      "code": ["class"],
      "pre": ["class"],
      "div": ["class"],
      "span": ["class"],
      "p": ["class"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Disallow javascript: and data: URIs
    disallowedTagsMode: "discard"
  });
}

// Convert markdown to sanitized HTML
export function markdownToSafeHtml(md: string): string {
  if (!md) return "";
  const rawHtml = marked.parse(md) as string;
  return sanitizeContent(rawHtml);
}

// Sanitize a plain-text field (title, organization, excerpt, etc.)
export function sanitizeTextField(value: string, maxLength = 500): string {
  if (!value) return "";
  return stripHtml(value).slice(0, maxLength);
}

// Validate and sanitize a URL — only allows http/https
export function sanitizeUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.href;
  } catch {
    return "";
  }
}

// Validate slug format — alphanumeric, hyphens only
export function sanitizeSlug(slug: string): string {
  if (!slug) return "";
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

// Sanitize a tag (single tag string)
export function sanitizeTag(tag: string): string {
  if (!tag) return "";
  return stripHtml(tag)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .slice(0, 50);
}
