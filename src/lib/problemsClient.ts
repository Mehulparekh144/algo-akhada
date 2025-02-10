import { LcProblem, UniqueProblem } from "./validations";

const URL = "https://leetcode-api-32hc.onrender.com"

export function getProblems(): Promise<LcProblem> {
  return fetch(`${URL}/problems?limit=1000`, {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then((res) => res.json()).catch(err => console.error(err))
}

export function getUniqueProblem(problemSlug: string): Promise<UniqueProblem> {
  return fetch(`${URL}/select?titleSlug=${problemSlug}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then((res) => res.json()).catch(err => console.error(err))
}