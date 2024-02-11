"use client";
import { SurveyDTO } from "@/types/SurveyDTO";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { variants } from "@/lib/animations";

const StartSurvey = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState<SurveyDTO["data"]>();

  const getSurvey = useCallback(async () => {
    const response = await fetch(`/api/surveys/${surveyId}`);
    const { data } = await response.json();
    setSurvey(data);
  }, [surveyId]);

  // @ts-ignore
  const firstQuestionId = survey?.questions[0].id;

  useEffect(() => {
    getSurvey();
  }, [surveyId, getSurvey]);

  return (
    <div className="bg-image">
      <motion.div
        className="py-14 mx-auto w-4/5 h-full"
        variants={variants}
        initial="initial"
        whileInView="animate"
      >
        <motion.div className="flex h-full" variants={variants}>
          <div className="h-full w-full">
            <div className="content p-8 font-normal">
              <div className="create-question flex-col flex justify-center h-full text-center rounded-md white-bg-80 py-12 px-8">
                <motion.h4
                  className="soft-mint-cream text-xl sm:text-4xl rounded-md mb-4 px-2 py-5"
                  variants={variants}
                >
                  {survey?.name}
                </motion.h4>
                {survey?.introduction && (
                  <p className="bg-white davys-grey  rounded-md text-base sm:text-2xl mb-4 px-2 py-4">
                    {survey?.introduction}
                  </p>
                )}

                <motion.div variants={variants} className="mt-4">
                  <Link
                    href={`/surveys/${surveyId}/questions/${firstQuestionId}`}
                    className="active-green inline-block text-white text-lg rounded-md px-6 sm:px-12 py-3 uppercase cursor-pointer"
                  >
                    start
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartSurvey;
