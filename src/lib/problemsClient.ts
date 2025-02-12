import { LcProblem, UniqueProblem } from "./validations";
import { redisClient } from './redis-client'

const CACHE_KEY = 'problems'
const CACHE_TTL = 3600 * 24 // 24 hours
const URL = "https://leetcode-api-32hc.onrender.com"

export async function getProblems(): Promise<LcProblem> {
  const cachedProblem: (string | null) = await redisClient.get(CACHE_KEY);
  if (cachedProblem) {
    console.log('Returning cached problems')
    return Promise.resolve(JSON.parse(cachedProblem))
  }

  console.log('Fetching problems from API')
  const problems = await fetch(`${URL}/problems?limit=1000`, {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then((res) => res.json()).catch(err => console.error(err))

  await redisClient.set(
    CACHE_KEY,
    JSON.stringify(problems)
    , {
      'EX': CACHE_TTL
    }
  )

  return problems
}

export function getUniqueProblem(problemSlug: string): Promise<UniqueProblem> {
  return fetch(`${URL}/select?titleSlug=${problemSlug}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then((res) => res.json()).catch(err => console.error(err))
}