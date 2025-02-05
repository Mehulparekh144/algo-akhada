import { env } from "@/env";
import { AuthOptions, getServerSession } from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    })
  ]
}


export { authOptions }