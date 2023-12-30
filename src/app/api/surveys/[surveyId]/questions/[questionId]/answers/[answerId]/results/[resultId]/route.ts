import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const uuidSchema = z.string().uuid();

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
    answerId: string;
    resultsId: string;
  };
};

export async function GET(request: NextRequest, { params }: ApiRequestContext) {
  try {
    // Validate the surveyId, questionId, answerId, and resultsId
    const validSurveyId = uuidSchema.parse(params.surveyId);
    const validQuestionId = uuidSchema.parse(params.questionId);
    const validAnswerId = uuidSchema.parse(params.answerId);
    const validResultsId = uuidSchema.parse(params.resultsId);

    // Fetch the specific result
    const result = await db.result.findFirst({
      where: {
        id: validResultsId,
        questionAnswer: {
          id: validAnswerId,
          questionId: validQuestionId,
          question: {
            surveyId: validSurveyId,
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          message: "Result not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result);
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
        message: "An internal server error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
