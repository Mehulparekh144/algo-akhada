import { prisma } from "@/lib/prisma";
import { Problem } from "@prisma/client";

export const POST = async (req: Request) => {
  try {
    const { data } = await req.json();

    const cleanData = data.map((d: Problem) => {
      return {
        titleSlug: d.titleSlug,
        title: d.title,
        difficulty: d.difficulty,
        acRate: d.acRate,
        link: d.link,
        hints: d.hints
      }
    })

    await prisma.problem.createMany({
      data : cleanData
    })

    return new Response(JSON.stringify(cleanData))
  } catch (error : any) {
    return new Response(error)
  }
  
}