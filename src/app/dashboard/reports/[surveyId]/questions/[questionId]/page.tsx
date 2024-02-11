import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import SentimentScoreMeter from "@/components/SentimentScoreMeter/SentimentScoreMeter";

interface SurveyQuestionReportPageProps {
  params: {
    surveyId: string;
    questionId: string;
  };
}

const getQuestion = async (surveyId: string, questionId: string) => {
  const question = await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      surveyId,
    },
    include: {
      report: true,
    },
  });

  return question;
};

const getQuestionData = async (surveyId: string, questionId: string) => {
  const answers = await prisma.questionAnswer.findMany({
    where: {
      question: {
        id: questionId,
        surveyId,
      },
    },
  });

  return answers;
};

export default async function QuestionAnswersReport({
  params,
}: SurveyQuestionReportPageProps) {
  const question = await getQuestion(params.surveyId, params.questionId);
  const answers = await getQuestionData(params.surveyId, params.questionId);

  const keywords = (question.report?.keywords || []).splice(0, 10);

  return (
    <div className="bg-image relative">
      <div className="question-report py-14 flex justify-between items-center mx-auto w-4/5 h-full">
        <Link
          href={`/dashboard/reports/${params.surveyId}`}
          className="answers-report-btn light-mint-green p-2 rounded-md inline-block absolute"
        >
          <Image
            src="/icons/leftArrow.png"
            alt="left arrow"
            className="left-arrow inline mr-1"
            width={16}
            height={16}
          />{" "}
          <button className="uppercase">back</button>
        </Link>
        <div className="flex h-5/6 w-4/6">
          <div className="mr-5">
            <div className="w-full h-full">
              <div className="content p-8 font-normal">
                <div className="h-full rounded-md white-bg-80 overflow-y-auto px-8 pt-4">
                  <h1 className="text-2xl text-center  mb-3 davys-grey ">
                    <b> Question:</b> {question.text}
                  </h1>
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-2 text-left">
                        <th className="w-8/12 text-xl py-4  font-medium  font-bold">
                          Answer
                        </th>
                        <th className="w-2/12 text-xl py-4  font-medium  font-bold text-center">
                          Score
                        </th>
                        <th className="w-2/12 py-4  text-xl font-medium  font-bold text-center">
                          Sentiment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {answers.map((answer) => (
                        <tr key={answer.id}>
                          <td className="table-td-border-bottom text-lg py-5 ">
                            {answer.answer}
                          </td>
                          <td className="table-td-border-bottom text-lg py-5 px-4 text-center">
                            {answer.sentimentScore}
                          </td>
                          <td className="table-td-border-bottom text-lg py-5  px-4 text-center">
                            {answer.sentimentLabel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/6 h-5/6">
          <div className="content p-8 font-normal">
            <div className="h-full rounded-md white-bg-80 px-8 pt-4">
              <h6 className="text-xl table-td-border-bottom text-center">
                Sentiment score
              </h6>
              {/* @ts-ignore */}
              <SentimentScoreMeter value={question.report?.sentimentScore} />

              <div
                className="overflow-y-auto h-full"
                style={{ maxHeight: "300px" }}
              >
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-2 ">
                      <th className="text-xl py-4  font-medium  font-bold">
                        Keywords
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword) => (
                      <tr key={keyword}>
                        <td className="table-td-border-bottom text-lg py-5  px-4 text-center">
                          {keyword}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
