import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LcProblem } from "./validations"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
