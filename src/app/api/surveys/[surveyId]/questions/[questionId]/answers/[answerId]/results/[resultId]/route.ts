import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
    answerId: string;
    resultsId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params: { surveyId, questionId, answerId, resultsId } }: ApiRequestContext
) {
  try {
    // Fetch the specific result
    const result = await db.result.findFirst({
      where: {
        id: resultsId,
        questionAnswer: {
          id: answerId,
          questionId: questionId,
          question: {
            surveyId: surveyId,
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
    console.error("An error occurred:", e);
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
