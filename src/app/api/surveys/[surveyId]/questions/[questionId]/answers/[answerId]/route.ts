// src/app/api/surveys/[surveyId]/questions/[questionId]/answers/[answerId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
    answerId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params: { surveyId, questionId, answerId } }: ApiRequestContext
) {
  try {
    // Fetch the specific answer
    const answer = await db.questionAnswer.findFirst({
      where: {
        id: answerId,
        questionId: questionId,
        // This line ensures the answer belongs to a question in the specified survey
        question: {
          surveyId: surveyId,
        },
      },
    });

    if (!answer) {
      return NextResponse.json(
        {
          message: "Answer not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(answer);
  } catch (e) {
    console.error(e); // Log the error for debugging
    return NextResponse.json(
      {
        message: "Unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
