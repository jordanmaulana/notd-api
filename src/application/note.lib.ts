export function extractHashTags(text: string): string[] {
  const parts = text.split(/(\#[a-zA-Z0-9_]+)/g);

  const tags = parts.filter((part) => part.startsWith("#"));

  return tags;
}
