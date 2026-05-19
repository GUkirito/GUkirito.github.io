import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listDirectory, createOrUpdateFile } from "@/lib/github";
import { parsePost, generateSlug, buildMarkdown, todayDate, PostMeta } from "@/lib/posts";

function toBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await listDirectory("content/posts");
    const posts: PostMeta[] = [];

    for (const f of files) {
      if (f.type !== "file" || !f.name.endsWith(".md")) continue;
      const slug = f.name.replace(/\.md$/, "");
      const dateMatch = f.name.match(/^(\d{4}-\d{2}-\d{2})-/);
      const date = dateMatch ? dateMatch[1] : "";

      let title = slug;
      let description = "";
      let categories: string[] = [];
      let tags: string[] = [];
      let draft = false;

      if (f.content && f.encoding === "base64") {
        try {
          const raw = Buffer.from(f.content, "base64").toString("utf-8");
          const parsed = parsePost(f.name, raw);
          title = parsed.title;
          description = parsed.description;
          categories = parsed.categories;
          tags = parsed.tags;
          draft = parsed.draft;
        } catch {
          // fall back to filename-based values
        }
      }

      posts.push({ slug, filename: f.name, title, date, description, categories, tags, draft });
    }

    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return NextResponse.json({ posts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, content, date: reqDate, categories, tags, draft } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const date = reqDate && /^\d{4}-\d{2}-\d{2}$/.test(reqDate) ? reqDate : todayDate();
    const slug = generateSlug(title);
    const filename = `${date}-${slug}.md`;
    const md = buildMarkdown(
      {
        title: title.trim(),
        date,
        description: (description || "").trim(),
        categories,
        tags,
        draft: draft === true,
      },
      content
    );
    const base64 = toBase64(md);

    await createOrUpdateFile(
      `content/posts/${filename}`,
      base64,
      `New post: ${title.trim()}`
    );

    return NextResponse.json({ slug, filename }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
