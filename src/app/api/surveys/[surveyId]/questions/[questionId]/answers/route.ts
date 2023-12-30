import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";

type ApiRequestContext = {
  params: {
    surveyId: string;
    questionId: string;
  };
};

export async function POST(
  request: NextRequest,
  { params: { surveyId, questionId } }: ApiRequestContext
) {
  try {
    // Verify that the specified question exists
    const questionExists = await db.question.findFirst({
      where: {
        id: questionId,
        surveyId: surveyId,
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

    // Parse the request body to get the answer data
    const body = await request.json();
    if (!body || !body.answer) {
      return NextResponse.json(
        {
          message: "Invalid answer data",
        },
        {
          status: 400,
        }
      );
    }

    // Create a new answer for the question
    const createdAnswer = await db.questionAnswer.create({
      data: {
        answer: body.answer,
        questionId: questionId,
      },
    });

    return NextResponse.json(createdAnswer);
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

export async function GET(
  request: NextRequest,
  { params: { surveyId, questionId } }: ApiRequestContext
) {
  try {
    // Fetch the specific question to ensure it exists
    const question = await db.question.findFirst({
      where: {
        id: questionId,
        surveyId: surveyId,
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
        questionId,
      },
    });

    return NextResponse.json(answersForQuestion);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          {
            message: "Question not found",
          },
          {
            status: 404,
          }
        );
      }
    }

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
