import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFile, createOrUpdateFile, deleteFile } from "@/lib/github";
import { parsePost, buildMarkdown, todayDate } from "@/lib/posts";

function toBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filePath = `content/posts/${params.slug}.md`;
    const file = await getFile(filePath);

    if (!file.content || file.encoding !== "base64") {
      return NextResponse.json({ error: "Invalid file encoding" }, { status: 500 });
    }

    const raw = Buffer.from(file.content, "base64").toString("utf-8");
    const post = parsePost(`${params.slug}.md`, raw, file.sha);

    return NextResponse.json(post);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("404")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filePath = `content/posts/${params.slug}.md`;

    // Get existing file for sha and original date
    const existing = await getFile(filePath);
    if (!existing.content || existing.encoding !== "base64") {
      return NextResponse.json({ error: "Invalid file encoding" }, { status: 500 });
    }

    const raw = Buffer.from(existing.content, "base64").toString("utf-8");
    const existingPost = parsePost(`${params.slug}.md`, raw);

    const { title, description, content } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const md = buildMarkdown(
      {
        title: title.trim(),
        date: existingPost.date || todayDate(),
        description: (description || "").trim(),
      },
      content
    );
    const base64 = toBase64(md);

    await createOrUpdateFile(
      filePath,
      base64,
      `Update post: ${title.trim()}`,
      existing.sha
    );

    return NextResponse.json({ slug: params.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("404")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filePath = `content/posts/${params.slug}.md`;
    const existing = await getFile(filePath);

    await deleteFile(filePath, existing.sha, `Delete post: ${params.slug}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("404")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
