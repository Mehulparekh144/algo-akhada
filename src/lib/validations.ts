import { z } from 'zod'


export const loginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6).nonempty(),
})

export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  ...loginSchema.shape,
  name: z.string().nonempty()
})

export type SignupValues = z.infer<typeof signupSchema>

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

export const difficultySchema = z.enum(['NOVICE', 'INTERMEDIATE', 'EXPERT'])
export const bookingSchema = z.object({
  date: z
    .date({
      required_error: "A date is required.",
    })
    .min(new Date(), "Date must be in the future"),
  startTime: z.string().refine((value) => {
    return !Number.isNaN(Date.parse(value));
  }, {
    message: "Invalid date format for starttime",
  }),
  difficulty: difficultySchema,
})

export type BookingValues = z.infer<typeof bookingSchema>
export type DifficultyValues = z.infer<typeof bookingSchema>['difficulty']

export const feedbackSchema = z.object({
  rating: z.number().int().positive().min(1).max(5),
  additionalComments: z.string().optional(),
  didUserSolve: z.boolean(),
  whatDidUserDoRight: z.string().min(10, "Please provide at least 10 characters about what they did well"),
  whatDidUserDoWrong: z.string().min(10, "Please provide at least 10 characters about what they could have done better"),
  howCanUserImprove: z.string().min(10, "Please provide at least 10 characters with suggestions for improvement"),
});

export type FeedbackValues = z.infer<typeof feedbackSchema>

