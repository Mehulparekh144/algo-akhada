"use server"

import { auth } from "@/lib/auth";
import model from "@/lib/gemini-client";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const getProblemsSolved = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const completedBookings = await prisma.booking.count({
    where: {
      AND: [
        {
          OR: [
            { user1Id: session.user.id },
            { user2Id: session.user.id }
          ]
        },
        {
          status: "COMPLETED"
        }
      ]
    }
  });

  const bookingsWithFeedbacks = await prisma.booking.count({
    where: {
      AND: [
        {
          OR: [
            { user1Id: session.user.id },
            { user2Id: session.user.id }
          ]
        },
        {
          status: "COMPLETED"
        },
        {
          feedbacks: {
            every: {
              userId: session.user.id,
            },
          },
        }
      ]
    }
  });

  console.log(bookingsWithFeedbacks);

  // Get all feedbacks where user solved the problem
  const problemsSolved = await prisma.feedback.count({
    where: {
      userId: session.user.id,
      didUserSolve: true
    }
  });

  return {
    totalBookings: completedBookings,
    problemsSolved: problemsSolved,
    pendingBookings: completedBookings - bookingsWithFeedbacks,
  };
};

export const fetchUserFeedbackInsights = async (isPremium: boolean) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  if (!isPremium) {
    return {
      insights: {
        patterns: ["Random 1", "Random 2", "Random 3"],
        improvements: ["Random 1", "Random 2", "Random 3"],
        successRate: "75%",
        progress: "No feedback data available for analysis yet."
      },
      summary: "No feedback data available for analysis yet."
    };
  }

  const allFeedbacks = await prisma.feedback.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      whatDidUserDoWrong: true,
      additionalComments: true,
      howCanUserImprove: true,
      whatDidUserDoRight: true,
      didUserSolve: true,
      rating: true
    }
  });

  // Filter out empty feedbacks and prepare data for analysis
  const validFeedbacks = allFeedbacks.filter(f => f.whatDidUserDoWrong && f.whatDidUserDoWrong.trim() !== "");

  if (validFeedbacks.length === 0) {
    return {
      insights: {
        patterns: [],
        improvements: [],
        successRate: "0%",
        progress: "No feedback data available for analysis yet."
      },
      summary: "No feedback data available for analysis yet."
    };
  }


  // Calculate success rate directly
  const successCount = validFeedbacks.filter(f => f.didUserSolve).length;
  const successRate = Math.round((successCount / validFeedbacks.length) * 100);

  // Prepare prompt for Gemini AI
  const prompt = `Analyze these coding feedback entries and provide concrete insights. Each entry contains what the user did wrong, what they did right, how they can improve, additional comments, whether they solved it, and their rating.

Feedback entries:
${validFeedbacks.map((f, index) => `Entry ${index + 1}:
----------------------------------------
What went wrong: "${f.whatDidUserDoWrong}"
----------------------------------------
What went right: "${f.whatDidUserDoRight || 'Not specified'}"
----------------------------------------
How to improve: "${f.howCanUserImprove || 'Not specified'}"
----------------------------------------
Additional comments: "${f.additionalComments || 'Not specified'}"
----------------------------------------
Solved: ${f.didUserSolve}
Rating: ${f.rating}
----------------------------------------`).join('\n\n')}

You MUST analyze the actual content of each feedback and provide a JSON response with these exact keys:

{
  "patterns": [
    // List EVERY coding pattern, approach, or technique mentioned in ANY of the feedback fields
    // Examples: "using loops", "recursive solution", "hashmap", "brute force", "dynamic programming"
    // If ANY feedback field mentions a coding concept, include it
  ],
  "improvements": [
    // List EVERY improvement area or concept mentioned in ANY of the feedback fields
    // Examples: "need to optimize", "handle edge cases", "better variable names", "more efficient"
    // Include improvements from both whatDidUserDoWrong and howCanUserImprove fields
  ],
  "successRate": "${successRate}%",
  "progress": "Describe specific improvements or changes mentioned across ALL feedback fields. Include both what went wrong and what went right to show evolution in approach."
}

IMPORTANT RULES:
1. You MUST analyze ALL fields of each feedback entry
2. Extract ANY coding patterns or techniques mentioned in ANY field
3. List ANY improvement areas suggested in ANY field
4. Use the exact success rate provided above
5. Describe ANY progress or learning shown across ALL fields
6. NEVER return empty arrays or placeholder text
7. If ANY field mentions a coding concept, include it
8. Focus on concrete, specific insights from ALL feedback content
9. Consider both positive (whatDidUserDoRight) and negative (whatDidUserDoWrong) feedback
10. Include improvements from both whatDidUserDoWrong and howCanUserImprove fields

Example of good analysis:
{
  "patterns": ["Using brute force approach", "Not considering edge cases", "Using nested loops", "Recursive solution", "Good use of hashmap for optimization"],
  "improvements": ["Need to optimize time complexity", "Should handle null inputs", "Better variable naming", "More efficient data structure", "Consider using dynamic programming"],
  "successRate": "60%",
  "progress": "Started with basic solution but improved to handle edge cases. Good use of hashmap for optimization, though still needs work on dynamic programming approach."
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log('Raw Gemini response:', responseText);

    // Extract JSON from the response if it's wrapped in markdown code blocks
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Clean up the JSON string
    jsonStr = jsonStr.trim()
      .replace(/^```json\s*/, '')  // Remove leading ```json
      .replace(/\s*```$/, '')      // Remove trailing ```
      .replace(/\\n/g, ' ')        // Replace newlines with spaces
      .replace(/\s+/g, ' ')        // Normalize whitespace
      .trim();

    console.log('Cleaned JSON string:', jsonStr);
    const insights = JSON.parse(jsonStr);

    // Format the insights for frontend display
    const formattedInsights = {
      patterns: insights.patterns || [],
      improvements: insights.improvements || [],
      successRate: insights.successRate || "0%",
      progress: insights.progress || "No progress data available."
    };

    return {
      insights: formattedInsights,
      summary: `Based on ${validFeedbacks.length} feedback entries`
    };
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return {
      insights: {
        patterns: [],
        improvements: [],
        successRate: "0%",
        progress: "Unable to generate insights at this time."
      },
      summary: "Error processing feedback data"
    };
  }
}

export const generateLearningPath = async (isPremium: boolean) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  if (!isPremium) {
    return {
      currentLevel: "Beginner",
      nextSteps: [],
      recommendedTopics: [],
      difficultyProgress: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      summary: "Start solving problems to get personalized recommendations."
    };
  }

  // Get all feedbacks and problems solved
  const allFeedbacks = await prisma.feedback.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      whatDidUserDoWrong: true,
      whatDidUserDoRight: true,
      howCanUserImprove: true,
      didUserSolve: true,
      rating: true,
      createdAt: true
    }
  });

  // Get all problems attempted
  const problemsAttempted = await prisma.booking.findMany({
    where: {
      OR: [
        { user1Id: session.user.id },
        { user2Id: session.user.id }
      ],
      status: "COMPLETED"
    },
    select: {
      user1Id: true,
      user2Id: true,
      problem1: {
        select: {
          title: true,
          difficulty: true,
        }
      },
      problem2: {
        select: {
          title: true,
          difficulty: true,
        }
      }
    }
  });

  if (allFeedbacks.length === 0) {
    return {
      currentLevel: "Beginner",
      nextSteps: [],
      recommendedTopics: [],
      difficultyProgress: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      summary: "Start solving problems to get personalized recommendations."
    };
  }

  const problems = problemsAttempted.map((p) => {
    if (p.user1Id === session.user.id) {
      return { ...p, problem: p.problem1 };
    }
    return { ...p, problem: p.problem2 };
  });


  // Prepare prompt for Gemini AI
  const prompt = `Analyze this user's coding history and create a personalized learning path. Consider their feedback history and problems attempted.

Problems Attempted:
${problems.map((p, index) => `Problem ${index + 1}:
----------------------------------------
Title: "${p.problem?.title}"
Difficulty: ${p.problem?.difficulty}
----------------------------------------`).join('\n\n')}

Feedback History:
${allFeedbacks.map((f, index) => `Entry ${index + 1} (${f.createdAt.toISOString()}):
----------------------------------------
What went wrong: "${f.whatDidUserDoWrong}"
----------------------------------------
What went right: "${f.whatDidUserDoRight || 'Not specified'}"
----------------------------------------
How to improve: "${f.howCanUserImprove || 'Not specified'}"
----------------------------------------
Solved: ${f.didUserSolve}
Rating: ${f.rating}
----------------------------------------`).join('\n\n')}

You MUST analyze this data and provide a JSON response with these exact keys:

{
  "currentLevel": "Current skill level (Beginner/Intermediate/Advanced)",
  "nextSteps": [
    // List of 3-5 specific, actionable next steps
    // Example: "Practice binary search problems"
    // Focus on immediate, achievable goals
  ],
  "recommendedTopics": [
    // List of 3-5 topics to focus on
    // Example: "Dynamic Programming"
    // Based on gaps in knowledge and current progress
  ],
  "difficultyProgress": {
    "easy": number (0-100),
    "medium": number (0-100),
    "hard": number (0-100)
  },
  "summary": "Brief overview of current progress and recommended focus areas"
}

IMPORTANT RULES:
1. Consider both problems attempted and feedback history
2. Analyze patterns in what went wrong and right
3. Look for gaps in knowledge based on topics
4. Consider difficulty progression
5. Provide specific, actionable recommendations
6. Focus on immediate next steps
7. Consider time-based progression
8. Account for success rate in recommendations
9. Suggest topics that build on current knowledge
10. Make recommendations based on actual performance

Example of good analysis:
{
  "currentLevel": "Intermediate",
  "nextSteps": [
    "Practice binary search problems",
    "Focus on dynamic programming basics",
    "Work on time complexity optimization"
  ],
  "recommendedTopics": [
    "Dynamic Programming",
    "Graph Algorithms",
    "System Design"
  ],
  "difficultyProgress": {
    "easy": 90,
    "medium": 65,
    "hard": 30
  },
  "summary": "Strong foundation in basic algorithms. Ready to tackle more complex problems. Focus on dynamic programming and graph algorithms to advance to next level."
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log('Raw Gemini response:', responseText);

    // Extract JSON from the response if it's wrapped in markdown code blocks
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Clean up the JSON string
    jsonStr = jsonStr.trim()
      .replace(/^```json\s*/, '')
      .replace(/\s*```$/, '')
      .replace(/\\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('Cleaned JSON string:', jsonStr);
    const analysis = JSON.parse(jsonStr);

    return {
      currentLevel: analysis.currentLevel || "Beginner",
      nextSteps: analysis.nextSteps || [],
      recommendedTopics: analysis.recommendedTopics || [],
      difficultyProgress: analysis.difficultyProgress || {
        easy: 0,
        medium: 0,
        hard: 0
      },
      summary: analysis.summary || "No learning path available."
    };
  } catch (error) {
    console.error("Error generating learning path:", error);
    return {
      currentLevel: "Beginner",
      nextSteps: [],
      recommendedTopics: [],
      difficultyProgress: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      summary: "Error generating learning path."
    };
  }
};
