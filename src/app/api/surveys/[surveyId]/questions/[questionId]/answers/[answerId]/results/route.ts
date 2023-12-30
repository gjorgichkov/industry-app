import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params: { surveyId, questionId, answerId } }: ApiRequestContext
) {
  try {
    // Fetch all results associated with the specific answer
    const results = await db.result.findMany({
      where: {
        questionAnswer: {
          id: answerId,
          questionId: questionId,
          question: {
            surveyId: surveyId,
          },
        },
      },
    });

    if (results.length === 0) {
      return NextResponse.json(
        {
          message: "No results found for this answer",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(results);
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

export async function POST(
  request: NextRequest,
  { params: { surveyId, questionId, answerId } }: ApiRequestContext
) {
  try {
    // Verify that the specified answer exists
    const answerExists = await db.questionAnswer.findFirst({
      where: {
        id: answerId,
        questionId: questionId,
        question: {
          surveyId: surveyId,
        },
      },
    });

    if (!answerExists) {
      return NextResponse.json(
        {
          message: "Answer not found",
        },
        {
          status: 404,
        }
      );
    }

    // Parse the request body to get the result data
    const body = await request.json();
    // Validate and process 'body' as needed

    // Create a new result for the answer
    const createdResult = await db.result.create({
      data: {
        ...body, // Include the fields required for 'Result' model
        questionAnswerId: answerId,
      },
    });

    return NextResponse.json(createdResult);
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
