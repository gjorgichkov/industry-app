import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import SurveySchema from "@/schemas/Survey";
import { ZodError } from "zod";
import routeHandler from "@/lib/routeHandler";
import { Survey } from "@prisma/client";
import nodemailer from "@/lib/nodemailer";

const getSurveyEmailTemplateHtml = (survey: Survey) => {
  const surveyUrl = `http://localhost:3000/surveys/${survey.id}`;
  const reportsUrl = `http://localhost:3000/dashboard/reports/${survey.id}`;

  return `
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333333;">Survey Creation Confirmation</h2>
    <p style="color: #555555;">Dear Admin,</p>
    <p style="color: #555555;">Your survey has been successfully created. You can now share the survey link with participants to gather their valuable feedback.</p>
    <p style="color: #555555;">Survey Link:</p>
    <a href="${surveyUrl}">${surveyUrl}</a>
    <p style="color: #555555;">Additionally, you can view the survey report by visiting the following link:</p>
    <a href="${reportsUrl}">${reportsUrl}</a>
    <p style="color: #555555;">Thank you for using our survey platform!</p>
  </div>`;
};

export const GET = routeHandler(async (request, context) => {
  const surveys = await prisma.survey.findMany({});

  return surveys;
});

export const POST = routeHandler(async (request, context) => {
  const body = await request.json();
  const validation = await SurveySchema.safeParseAsync(body);

  if (!validation.success) {
    throw validation.error;
  }

  const { data } = validation;

  const survey = await prisma.survey.create({
    data,
  });

  // nodemailer.sendMail({
  //   from: process.env.SMTP_MAIL_FROM,
  //   to: survey.manager,
  //   subject: "New Survey Created",
  //   html: getSurveyEmailTemplateHtml(survey),
  // });

  return survey;
});
