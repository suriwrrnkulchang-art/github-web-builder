import { customAlphabet } from "nanoid";

const randomCode = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  8
);

export function normalizeSlug(input) {
  if (!input) {
    return "site";
  }

  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "site";
}

export function generateProjectCode() {
  return randomCode();
}

export function createSlug(name) {
  const safeName = normalizeSlug(name);
  const code = generateProjectCode();

  return `${safeName}-${code}`;
}

export function createUrl(baseUrl, slug) {
  return `${baseUrl.replace(/\/$/, "")}/${slug}/`;
}
