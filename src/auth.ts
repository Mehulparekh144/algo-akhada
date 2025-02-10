import NextAuth, { CredentialsSignin } from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from "./lib/prisma";
import bcrypt from 'bcryptjs';
import { loginSchema } from "./lib/validations";

class CustomError extends CredentialsSignin {
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const { email, password } = loginSchema.parse(credentials);

        let user = await prisma.user.findUnique({
          where: {
            email: email
          }
        });

        if (!user || !user.password) {
          throw new CustomError('User doesn\'t exists');
        }

        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
          throw new CustomError('Invalid credentials');
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID and image to the session object
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user ID and image to the JWT token
      if (user) {
        token.sub = user.id;
        token.picture = user.image;
      }
      return token;
    }
  },
  pages: {
    signIn: "/signin",
    error: "/signin"
  }
});