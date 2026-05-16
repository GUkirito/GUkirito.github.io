import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const ALLOWED_USER = process.env.ALLOWED_USER || "gukirito";

export { ALLOWED_USER };

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      // Log for debugging — visible in Vercel Function Logs
      const login = (profile as { login?: string } | undefined)?.login;
      console.log("[auth] signIn attempt — login:", login, "allowed:", ALLOWED_USER);

      if (!login) {
        console.log("[auth] signIn REJECTED: no login in profile");
        return "/login?error=no_login";
      }

      const match = login.toLowerCase() === ALLOWED_USER.toLowerCase();
      if (!match) {
        console.log("[auth] signIn REJECTED: mismatch", login, "!==", ALLOWED_USER);
        return `/login?error=unauthorized&user=${encodeURIComponent(login)}`;
      }

      console.log("[auth] signIn OK:", login);
      return true;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.githubLogin = (profile as { login?: string }).login;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { login?: string }).login =
          (token.githubLogin as string) || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
