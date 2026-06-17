const PUNCTUATION_PATTERN = /[.,/#!$%^&*;:{}=\-_`~()'"?]/g;

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(PUNCTUATION_PATTERN, "")
    .replace(/\s+/g, " ");
}

export function matchesAnyAlias(input: string, aliases: string[]): boolean {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;

  return aliases.some((alias) => normalizeAnswer(alias) === normalized);
}

export function formatAliasList(aliases: string[]): string {
  if (aliases.length <= 1) return aliases[0] ?? "";
  if (aliases.length === 2) return `${aliases[0]} or ${aliases[1]}`;
  return `${aliases.slice(0, -1).join(", ")}, or ${aliases.at(-1)}`;
}
