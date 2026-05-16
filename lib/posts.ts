import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  filename: string;
  title: string;
  date: string;
  description: string;
}

export interface Post extends PostMeta {
  content: string;
  sha?: string;
}

export function parsePost(
  filename: string,
  rawContent: string,
  sha?: string
): Post {
  const slug = filename.replace(/\.md$/, "");
  const { data, content } = matter(rawContent);
  return {
    slug,
    filename,
    title: data.title || "",
    date: toDateString(data.date),
    description: data.description || "",
    content,
    sha,
  };
}

export function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-鿿\-]/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

export function buildMarkdown(meta: {
  title: string;
  date: string;
  description: string;
}, body: string): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return [
    "---",
    `title: "${esc(meta.title)}"`,
    `date: ${meta.date}`,
    `description: "${esc(meta.description)}"`,
    "---",
    "",
    body.trimStart(),
  ].join("\n");
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function toDateString(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10);
  return "";
}
