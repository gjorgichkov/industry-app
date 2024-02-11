import prisma from "@/lib/prisma";
import Survey from "@/schemas/Survey";
import routeHandler from "@/lib/routeHandler";
import { SurveyStatus } from "@prisma/client";
import keyword_extractor from "keyword-extractor";

export const GET = routeHandler(async (request, context) => {
  const { surveyId } = context.params;
  const survey = await prisma.survey.findUniqueOrThrow({
    where: {
      id: surveyId,
    },
    include: {
      questions: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return survey;
});
export const PATCH = routeHandler(async (request, context) => {
  const { surveyId } = context.params;
  const body = await request.json();

  const validation = await Survey.safeParseAsync(body);
  if (!validation.success) {
    throw validation.error;
  }
  const { data } = validation;
  const survey = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data,
  });

  if (data.status === SurveyStatus.FINISHED) {
    const questions = await prisma.question.findMany({
      where: { surveyId },
      include: { answers: true },
    });

    const questionReportsData = questions.map((question) => {
      const { weightedSum, totalSum, answersString } = question.answers.reduce(
        (acc, currentAnswer) => {
          const multiplier =
            currentAnswer.sentimentLabel === "NEGATIVE" ? -1 : 1;
          acc.weightedSum =
            acc.weightedSum + (currentAnswer.sentimentScore || 0) * multiplier;
          acc.totalSum = acc.totalSum + (currentAnswer.sentimentScore || 0);
          acc.answersString += currentAnswer.answer;
          return acc;
        },
        { weightedSum: 0, totalSum: 0, answersString: "" }
      );

      const globalSentimentScore = weightedSum / totalSum;

      const keywords = keyword_extractor.extract(answersString, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });

      return {
        sentimentScore: +globalSentimentScore.toFixed(5),
        keywords,
        questionId: question.id,
      };
    });

    await prisma.questionReport.createMany({
      data: questionReportsData,
    });
  }
  return survey;
});

export const DELETE = routeHandler(async (_, context) => {
  const { surveyId } = context.params;

  await prisma.survey.delete({
    where: {
      id: surveyId,
    },
  });
});
