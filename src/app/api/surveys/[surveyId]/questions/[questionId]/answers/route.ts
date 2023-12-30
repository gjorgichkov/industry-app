import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { z } from "zod";

const uuidSchema = z.string().uuid();

const answerCreateSchema = z.object({
  answer: z.string(),
});

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
  };
};

export async function POST(
  request: NextRequest,
  { params }: ApiRequestContext
) {
  try {
    // Validate the surveyId and questionId
    const validSurveyId = uuidSchema.parse(params.surveyId);
    const validQuestionId = uuidSchema.parse(params.questionId);

    // Verify that the specified question exists
    const questionExists = await db.question.findFirst({
      where: {
        id: validQuestionId,
        surveyId: validSurveyId,
      },
    });

    if (!questionExists) {
      return NextResponse.json(
        {
          message: "Question not found",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    // Validate the request body
    const parsedBody = answerCreateSchema.parse(body);

    const createdAnswer = await db.questionAnswer.create({
      data: {
        answer: parsedBody.answer,
        questionId: validQuestionId,
      },
    });

    return NextResponse.json(createdAnswer);
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
        message: "Unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest, { params }: ApiRequestContext) {
  try {
    // Validate the surveyId and questionId
    const validSurveyId = uuidSchema.parse(params.surveyId);
    const validQuestionId = uuidSchema.parse(params.questionId);

    // Fetch the specific question to ensure it exists
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

    // Fetch the answers for the specific question
    const answersForQuestion = await db.questionAnswer.findMany({
      where: {
        questionId: validQuestionId,
      },
    });

    return NextResponse.json(answersForQuestion);
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
