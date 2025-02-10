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
    return !isNaN(Date.parse(value));
  }, {
    message: "Invalid date format for starttime",
  }),
  difficulty: difficultySchema,
})



export type BookingValues = z.infer<typeof bookingSchema>
export type DifficultyValues = z.infer<typeof bookingSchema>['difficulty']

// Define the schema for a single topic tag
const topicTagSchema = z.object({
  name: z.string(),
  id: z.string(),
  slug: z.string(),
});

// Define the schema for a single question
const questionSchema = z.object({
  acRate: z.number(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  freqBar: z.nullable(z.unknown()), // Assuming freqBar can be null or any type
  questionFrontendId: z.string(),
  isFavor: z.boolean(),
  isPaidOnly: z.boolean(),
  status: z.nullable(z.unknown()), // Assuming status can be null or any type
  title: z.string(),
  titleSlug: z.string(),
  topicTags: z.array(topicTagSchema),
  hasSolution: z.boolean(),
  hasVideoSolution: z.boolean(),
});

// Define the schema for the entire JSON structure
const lcProblemSchema = z.object({
  totalQuestions: z.number(),
  count: z.number(),
  problemsetQuestionList: z.array(questionSchema),
});


export type LcProblem = z.infer<typeof lcProblemSchema>
export type ProblemSetQuestionList = LcProblem['problemsetQuestionList']

const uniqueProblemSchema = z.object({
  link: z.string(),
  questionTitle: z.string(),
  titleSlug: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  question: z.string(),
  exampleTestcases: z.string(),
  topicTags: z.array(z.object(
    {
      name: z.string(),
      slug: z.string(),
      translatedName: z.string()
    }
  )),
  hints: z.array(z.string()),
})

export type UniqueProblem = z.infer<typeof uniqueProblemSchema>