import routeHandler from "@/lib/routeHandler";
import prisma from "@/lib/prisma";
import Question from "@/schemas/Question";
import { isUndefined } from "lodash";

export const DELETE = routeHandler(async (request, context) => {
  const { surveyId, questionId } = context.params;

  // Fetch the survey along with its questions to find the position of the question to be deleted
  const survey = await prisma.survey.findUniqueOrThrow({
    where: {
      id: surveyId,
    },
    include: {
      questions: true,
    },
  });

  const questionToDelete = survey.questions.find((q) => q.id === questionId);

  if (!questionToDelete) {
    throw new Error("Question not found");
  }

  // Delete the question
  const response = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        delete: {
          id: questionId,
        },
      },
    },
    include: {
      questions: true,
    },
  });

  // Decrement the positions of questions that come after the deleted question
  const updatePositions = await prisma.question.updateMany({
    where: {
      surveyId: surveyId,
      position: {
        gt: questionToDelete.position,
      },
    },
    data: {
      position: {
        decrement: 1,
      },
    },
  });

  return response;
});

export const GET = routeHandler(async (request, context) => {
  const { questionId } = context.params;
  const question = await prisma.question.findUniqueOrThrow({
    where: {
      id: questionId,
    },
    include: {
      answers: true,
    },
  });

  return question;
});

export const PATCH = routeHandler(async (request, context) => {
  const { surveyId, questionId } = context.params;
  const data = await request.json();

  const question = await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      surveyId,
    },
  });

  if (!isUndefined(data.position) && question.position !== data.position) {
    const [positionFrom, positionTo] = [question.position, data.position];

    if (positionTo > positionFrom) {
      let questionsToReposition = await prisma.question.findMany({
        where: {
          surveyId,
          position: {
            gt: positionFrom,
            lte: positionTo,
          },
        },
      });

      let updatedQuestions = questionsToReposition.map((q) => {
        const newPosition = q.position - 1;
        return prisma.question.update({
          where: { id: q.id },
          data: { position: newPosition },
        });
      });

      await prisma.$transaction(updatedQuestions);
    } else {
      let questionsToReposition = await prisma.question.findMany({
        where: {
          surveyId,
          position: {
            gte: positionTo,
            lt: positionFrom,
          },
        },
      });

      let updatedQuestions = questionsToReposition.map((q) => {
        const newPosition = q.position + 1;
        return prisma.question.update({
          where: { id: q.id },
          data: { position: newPosition },
        });
      });

      await prisma.$transaction(updatedQuestions);
    }
  }

  const response = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        update: {
          where: {
            id: questionId,
          },
          data,
        },
      },
    },
  });

  return response;
});
