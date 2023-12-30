import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const surveys = await db.survey.findMany({});
  return NextResponse.json({ surveys });
}

const surveySchema = z.object({
  name: z.string(),
  introduction: z.string(),
  manager: z.string().email(),
  status: z.enum(["DRAFT", "ONGOING", "FINISHED"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body against the schema
    const parsedBody = surveySchema.parse(body);

    const createdSurvey = await db.survey.create({
      data: parsedBody,
    });

    return NextResponse.json(createdSurvey);
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
