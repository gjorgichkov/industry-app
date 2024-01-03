import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { z } from "zod";

const surveyIdSchema = z.object({
  surveyId: z.string().uuid(),
});

const questionCreateSchema = z.object({
  text: z.string(),
  required: z.boolean(),
  position: z.number(),
});

const questionsCreateSchema = z.array(questionCreateSchema);

type ApiRequestContext = {
  params: {
    surveyId: string;
  };
};

export async function POST(
  request: NextRequest,
  { params }: ApiRequestContext
) {
  try {
    const { surveyId } = surveyIdSchema.parse(params);

    const body = await request.json();

    // Validate the request body as an array of questions
    const parsedQuestions = questionsCreateSchema.parse(body);

    // Batch create questions
    const createdQuestions = await db.question.createMany({
      data: parsedQuestions.map((question) => ({
        ...question,
        surveyId,
      })),
    });

    return NextResponse.json(createdQuestions);
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
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json(
        {
          message: "Survey not found",
        },
        {
          status: 404,
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
    // Validate the surveyId parameter
    const { surveyId } = surveyIdSchema.parse(params);

    const questionsForSurvey = await db.question.findMany({
      where: {
        surveyId,
      },
    });

    return NextResponse.json(questionsForSurvey);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid survey ID",
          errors: e.errors,
        },
        {
          status: 400,
        }
      );
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json(
        {
          message: "Survey not found",
        },
        {
          status: 404,
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
