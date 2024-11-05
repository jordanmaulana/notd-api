export function extractHashTags(text: string): string[] {
  const parts = text.split(/(#[a-zA-Z0-9_]+)/g);

  const tags = parts
    .filter((part) => part.startsWith("#"))
    .map((tag) => tag.slice(1));

  return tags;
}
