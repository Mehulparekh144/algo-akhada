import { time } from 'console'
import { z } from 'zod'

export const problemSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  testcases: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })),
  timeLimit: z.number().int().positive(),
  constraints: z.string().min(10),
})

export type ProblemValues = z.infer<typeof problemSchema>