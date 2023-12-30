import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { z } from "zod";

const uuidSchema = z.string().uuid();

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params: { surveyId, questionId } }: ApiRequestContext
) {
  try {
    const validSurveyId = uuidSchema.parse(surveyId);
    const validQuestionId = uuidSchema.parse(questionId);

    const survey = await db.survey.findUniqueOrThrow({
      where: {
        id: validSurveyId,
      },
    });

    const question = await db.question.findFirst({
      where: {
        id: validQuestionId,
        surveyId: validSurveyId,
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          message: "Question not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(question);
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
