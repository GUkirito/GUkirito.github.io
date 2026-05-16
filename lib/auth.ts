import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const ALLOWED_USER = process.env.ALLOWED_USER || "gukirito";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      const login = (profile as { login?: string } | undefined)?.login;
      if (!login) return false;
      return login.toLowerCase() === ALLOWED_USER.toLowerCase();
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
