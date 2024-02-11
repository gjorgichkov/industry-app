"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { QuestionDTO } from "@/types/QuestionDTO";

const EditSurveyQuestionPage = () => {
  const { surveyId, questionId } = useParams();
  const [question, setQuestion] = useState<QuestionDTO["data"]>();
  const questionNameRef = useRef<HTMLTextAreaElement>(null);
  const mandatoryRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const getQuestion = useCallback(async () => {
    const response = await fetch(
      `/api/surveys/${surveyId}/questions/${questionId}`
    );
    const { data } = await response.json();
    setQuestion(data);
  }, [questionId, surveyId]);

  useEffect(() => {
    getQuestion();
  }, [questionId, getQuestion]);

  const handleUpdateQuestion = async () => {
    await fetch(`/api/surveys/${surveyId}/questions/${questionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        text: questionNameRef.current?.value,
        required: !mandatoryRef.current?.checked,
      }),
    });

    return router.push(`/dashboard/surveys/${surveyId}/questions`);
  };
  return (
    <div className="bg-image">
      <div className="py-14 mx-auto w-4/5 h-full">
        <div className="flex h-5/6">
          <div className="w-full">
            <form className="h-full">
              <div className="flex justify-between items-center mb-12">
                <Link href={`/dashboard/surveys/${surveyId}/questions`}>
                  <div className="light-mint-green flex justify-center items-center p-2 rounded-md">
                    <Image
                      src="/icons/leftArrow.png"
                      alt="left arrow"
                      className="left-arrow inline mr-1"
                      width={16}
                      height={16}
                    />{" "}
                    <button className="uppercase">back</button>
                  </div>
                </Link>
              </div>

              <div className="h-full">
                <div className="content p-8 font-normal">
                  <div className="create-question flex-col flex justify-center h-full text-center rounded-md white-bg-80 py-12 px-8">
                    <h4 className="text-4xl davys-grey uppercase mb-5">
                      edit your question
                    </h4>
                    <p className="medium-grey uppercase text-xs mb-4">
                      Enter the question and continue with the further creation
                      process
                    </p>

                    <textarea
                      ref={questionNameRef}
                      name="text"
                      id="enter-question"
                      className="textarea-inputs-bg w-full rounded-md p-3 text-xl mb-2"
                      cols={20}
                      rows={4}
                      placeholder="ENTER THE QUESTION"
                      defaultValue={question?.text}
                    ></textarea>

                    {/* mandatory */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="pl-3">
                        <label
                          htmlFor="mandatory"
                          className="uppercase mr-2 medium-grey"
                        >
                          optional
                        </label>
                        <input
                          ref={mandatoryRef}
                          type="checkbox"
                          id="mandatory"
                          defaultChecked={question?.required}
                        />
                      </div>

                      {/* right btns */}
                      <div>
                        <a
                          onClick={() => handleUpdateQuestion()}
                          className="active-green text-white  text-lg rounded-md px-6 py-2 uppercase cursor-pointer"
                        >
                          save
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditSurveyQuestionPage;
