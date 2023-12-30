import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { z } from "zod";

const surveyIdSchema = z.object({
  surveyId: z.string().uuid(),
});

type ApiRequestContext = {
  params: {
    surveyId: string;
  };
};

export async function GET(request: NextRequest, { params }: ApiRequestContext) {
  try {
    // Validate the surveyId parameter
    const { surveyId } = surveyIdSchema.parse(params);

    const surveys = await db.survey.findUniqueOrThrow({
      where: {
        id: surveyId,
      },
    });

    return NextResponse.json(surveys);
  } catch (e) {
    if (e instanceof z.ZodError) {
      // If Zod validation fails
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
      // If the survey is not found in the database
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
