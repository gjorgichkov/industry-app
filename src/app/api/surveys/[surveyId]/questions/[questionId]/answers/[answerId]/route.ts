import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { z } from "zod";

const uuidSchema = z.string().uuid();

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
    answerId: string;
  };
};

export async function GET(request: NextRequest, { params }: ApiRequestContext) {
  try {
    // Validate the surveyId, questionId, and answerId
    const validSurveyId = uuidSchema.parse(params.surveyId);
    const validQuestionId = uuidSchema.parse(params.questionId);
    const validAnswerId = uuidSchema.parse(params.answerId);

    // Fetch the specific answer
    const answer = await db.questionAnswer.findFirst({
      where: {
        id: validAnswerId,
        questionId: validQuestionId,
        question: {
          surveyId: validSurveyId,
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
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid UUID format",
          errors: e.errors,
        },
        {
          status: 400,
        }
      );
    }

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
