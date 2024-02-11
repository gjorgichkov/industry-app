import prisma from "@/lib/prisma";
import Link from "next/link";
import { HiOutlineDocumentReport } from "react-icons/hi";

const getQuestionsForSurvey = async (surveyId: string) => {
  const questions = await prisma.question.findMany({
    where: {
      surveyId,
    },
    orderBy: {
      position: "asc",
    },
    include: {
      report: true,
      answers: true,
    },
  });

  const data = questions.map(({ id, text, answers, report, position }) => ({
    id,
    text,
    answersCount: answers.length,
    score: report?.sentimentScore,
    position,
  }));

  return data;
};

interface SurveyQuestionsPageProps {
  params: {
    surveyId: string;
  };
}

export default async function ReportQuetions({
  params,
}: SurveyQuestionsPageProps) {
  const questions = await getQuestionsForSurvey(params.surveyId);
  return (
    <div className="bg-image">
      <div className="py-14 flex justify-center items-center mx-auto w-4/5 h-full">
        <div className="flex h-5/6 w-full">
          <div className="w-full">
            <div className="h-full">
              <div className="content p-8 font-normal">
                <div className="h-full rounded-md white-bg-80 overflow-y-auto px-8 pt-4">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-2 text-left">
                        <th className="w-6/12 text-xl py-4 px-4 font-medium davys-grey font-bold">
                          Question
                        </th>
                        <th className="w-2/12  text-xl py-4 px-4 font-medium davys-grey font-bold text-center">
                          Answers
                        </th>
                        <th className="w-2/12 text-xl py-4 px-4 font-medium davys-grey font-bold text-center">
                          Sentiment score
                        </th>
                        <th className="w-2/12 py-4 px-4 text-xl font-medium davys-grey font-bold text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => (
                        <tr key={question.id}>
                          <td className="table-td-border-bottom text-lg py-5 px-4">
                            {question.position + 1}. {question.text}
                          </td>
                          <td className="table-td-border-bottom text-lg py-5 px-4 text-center">
                            {question.answersCount}
                          </td>
                          <td className="table-td-border-bottom text-lg py-5  px-4 text-center">
                            {question.score || "N/A"}
                          </td>
                          <td className="table-td-border-bottom text-lg py-5 px-4 text-center">
                            <Link
                              href={`/dashboard/reports/${params.surveyId}/questions/${question.id}`}
                            >
                              <HiOutlineDocumentReport className="text-center inline-block" />
                            </Link>
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
    </div>
  );
}
