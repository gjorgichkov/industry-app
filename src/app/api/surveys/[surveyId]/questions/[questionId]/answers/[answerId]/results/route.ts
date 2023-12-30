import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const uuidSchema = z.string().uuid();

const resultCreateSchema = z.object({
  sentimentScore: z.string(),
  keywords: z.array(z.string()),
  summary: z.string(),
});

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
    answerId: string;
  };
};

export async function POST(
  request: NextRequest,
  { params }: ApiRequestContext
) {
  try {
    // Validate the surveyId, questionId, and answerId
    const validSurveyId = uuidSchema.parse(params.surveyId);
    const validQuestionId = uuidSchema.parse(params.questionId);
    const validAnswerId = uuidSchema.parse(params.answerId);

    // Verify that the specified answer exists
    const answerExists = await db.questionAnswer.findFirst({
      where: {
        id: validAnswerId,
        questionId: validQuestionId,
        question: {
          surveyId: validSurveyId,
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

    const body = await request.json();
    // Validate the request body
    const parsedBody = resultCreateSchema.parse(body);

    // Create a new result for the answer
    const createdResult = await db.result.create({
      data: {
        ...parsedBody,
        questionAnswerId: validAnswerId,
      },
    });

    return NextResponse.json(createdResult);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request data",
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

export async function GET(request: NextRequest, { params }: ApiRequestContext) {
  try {
    // Validate the surveyId, questionId, and answerId
    const validSurveyId = uuidSchema.parse(params.surveyId);
    const validQuestionId = uuidSchema.parse(params.questionId);
    const validAnswerId = uuidSchema.parse(params.answerId);

    // Fetch all results associated with the specific answer
    const results = await db.result.findMany({
      where: {
        questionAnswer: {
          id: validAnswerId,
          questionId: validQuestionId,
          question: {
            surveyId: validSurveyId,
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
