const GITHUB_API = "https://api.github.com";
const REPO = process.env.GITHUB_REPO!;
const TOKEN = process.env.GITHUB_TOKEN!;

function apiHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export async function listDirectory(dirPath: string): Promise<GitHubFile[]> {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${dirPath}`;
  const res = await fetch(url, { headers: apiHeaders(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function getFile(filePath: string): Promise<GitHubFile> {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${filePath}`;
  const res = await fetch(url, { headers: apiHeaders(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function createOrUpdateFile(
  filePath: string,
  contentBase64: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${filePath}`;
  const body: Record<string, string> = {
    message,
    content: contentBase64,
    branch: "main",
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: apiHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function deleteFile(
  filePath: string,
  sha: string,
  message: string
): Promise<void> {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${filePath}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: apiHeaders(),
    body: JSON.stringify({ message, sha, branch: "main" }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
}
