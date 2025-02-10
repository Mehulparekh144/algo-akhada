"use server"

import { prisma } from "@/lib/prisma";
import { signupSchema, SignupValues } from "@/lib/validations";
import bcrypt from 'bcryptjs'


export async function signup(data: SignupValues) {

  const { email, password, name } = signupSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })
}