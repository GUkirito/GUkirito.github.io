import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  filename: string;
  title: string;
  date: string;
  description: string;
  categories: string[];
  tags: string[];
  draft: boolean;
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
    categories: normalizeStringArray(data.categories),
    tags: normalizeStringArray(data.tags),
    draft: data.draft === true || data.draft === "true",
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

export function buildMarkdown(
  meta: {
    title: string;
    date: string;
    description: string;
    categories?: string[];
    tags?: string[];
    draft?: boolean;
  },
  body: string
): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const lines: string[] = [
    "---",
    `title: "${esc(meta.title)}"`,
    `date: ${meta.date}`,
    `description: "${esc(meta.description)}"`,
  ];

  if (meta.categories && meta.categories.length > 0) {
    const cats = meta.categories.map((c) => `"${esc(c)}"`).join(", ");
    lines.push(`categories: [${cats}]`);
  }

  if (meta.tags && meta.tags.length > 0) {
    const tags = meta.tags.map((t) => `"${esc(t)}"`).join(", ");
    lines.push(`tags: [${tags}]`);
  }

  if (meta.draft) {
    lines.push("draft: true");
  }

  lines.push("---", "", body.trimStart());
  return lines.join("\n");
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function toDateString(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10);
  return "";
}

function normalizeStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}