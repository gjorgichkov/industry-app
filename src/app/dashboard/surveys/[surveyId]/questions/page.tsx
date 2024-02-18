"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import LeftColumn from "@/components/LeftColumn/LeftColumn";
import { QuestionsDTO } from "@/types/QuestionDTO";
import { isNumber, noop } from "lodash";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import { IoReorderThreeSharp } from "react-icons/io5";

const Questions = () => {
  const [questions, setQuestions] = useState<QuestionsDTO["data"]>([]);
  const [createQuestion, setCreateQuestion] = useState<boolean>(true);
  const [enterQuestion, setEnterQuestion] = useState<boolean>(false);
  const router = useRouter();
  const { surveyId } = useParams();
  const questionNameRef = useRef<HTMLTextAreaElement>(null);
  const mandatoryRef = useRef<HTMLInputElement>(null);

  const getQuestions = useCallback(async () => {
    const response = await fetch(`/api/surveys/${surveyId}/questions`);
    const { data } = await response.json();

    setQuestions(data);
  }, [surveyId]);

  const handleCreateQuestion = () => {
    setCreateQuestion(false);
    setEnterQuestion(true);
  };

  const handleOnCancel = () => {
    if (questionNameRef.current) {
      questionNameRef.current.value = "";
    }
    if (mandatoryRef.current) {
      mandatoryRef.current.checked = false;
    }
  };

  const handleEditQuestion = async (questionId: string) => {
    return router.push(
      `/dashboard/surveys/${surveyId}/questions/${questionId}`
    );
  };

  const handleAddQuestion = async () => {
    await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      body: JSON.stringify({
        text: questionNameRef.current?.value,
        required: !mandatoryRef.current?.checked,
      }),
    });

    handleOnCancel();
    getQuestions();
  };

  const handleDuplicateQuestion = async (
    questionText: string,
    questionRequired: boolean
  ) => {
    await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      body: JSON.stringify({
        text: questionText,
        required: questionRequired,
      }),
    });

    getQuestions();
  };

  const handleDeleteQuestion = async (questionId: string) => {
    await fetch(`/api/surveys/${surveyId}/questions/${questionId}`, {
      method: "DELETE",
    });

    getQuestions();
  };

  const handlePositionChange = async (event: SortableEvent) => {
    if (!isNumber(event.oldIndex)) return;
    console.log(event);
    const question = questions[event.oldIndex];
    const response = await fetch(
      `/api/surveys/${surveyId}/questions/${question.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          position: event.newIndex,
        }),
      }
    );
    const { data } = await response.json();
    getQuestions();
  };

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  return (
    <div className="bg-image">
      <div className="py-14 mx-auto w-4/5 h-full">
        <div className="flex h-5/6">
          {/* left column */}
          <LeftColumn />
          {/* right coloumn basic */}
          <div className="w-2/3">
            <form className="h-full">
              <div className="flex justify-between items-center mb-12">
                <Link href={`/dashboard/surveys/${surveyId}`}>
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
              <div className="relative h-full">
                <div className="content p-8 font-normal">
                  <h4 className="dim-gray text-center text-2xl uppercase mb-4">
                    survey questions
                  </h4>

                  {/* created questions */}
                  {/* {questions && ( */}

                  <div className="created-questions mb-7">
                    <ReactSortable
                      list={questions}
                      setList={setQuestions}
                      animation={200}
                      handle=".handle"
                      onEnd={handlePositionChange}
                    >
                      {questions.map((question) => (
                        <div key={question.id}>
                          <div className="question white-bg-80 p-2 rounded-md mb-2 handle">
                            <div className="flex justify-between items-center">
                              <div className="handle cursor-move w-4/6">
                                <p>
                                  <span className="pr-2">
                                    <IoReorderThreeSharp className="inline-block text-xl" />
                                  </span>
                                  <span className="mr-1">
                                    {question.position + 1}.
                                  </span>
                                  {question.text}
                                </p>
                              </div>
                              <div className="w-2/6">
                                <span
                                  onClick={() =>
                                    handleDuplicateQuestion(
                                      question.text,
                                      question.required
                                    )
                                  }
                                  className="bg-white rounded-md uppercase mr-2 px-2 py-1 cursor-pointer text-sm"
                                >
                                  duplicate
                                </span>
                                <span
                                  onClick={() =>
                                    handleEditQuestion(question.id)
                                  }
                                  className="bg-white rounded-md uppercase mr-2 px-2 py-1 cursor-pointer text-sm"
                                >
                                  edit
                                </span>
                                <span
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
                                  className="bg-white rounded-md uppercase px-2 py-1 cursor-pointer text-sm"
                                >
                                  delete
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ReactSortable>
                  </div>
                  {/* )} */}

                  {createQuestion && (
                    <div className="create-survey text-center rounded-md white-bg-80 py-3 px-8 mb-3">
                      <h4
                        className="davys-grey uppercase cursor-pointer"
                        onClick={handleCreateQuestion}
                      >
                        create question +
                      </h4>
                    </div>
                  )}

                  {enterQuestion && (
                    <div className="create-question text-center rounded-md white-bg-80 py-3 px-8">
                      <h4 className="davys-grey uppercase">
                        creating a new question
                      </h4>
                      <p className="medium-grey uppercase text-xs mb-4">
                        Enter the question and continue with the further
                        creation process
                      </p>

                      <textarea
                        ref={questionNameRef}
                        name="enterQuestion"
                        id="enter-question"
                        className="textarea-inputs-bg w-full rounded-md p-3 text-xl mb-2"
                        cols={20}
                        rows={4}
                        placeholder="ENTER THE QUESTION"
                      ></textarea>

                      {/* mandatory */}
                      <div className="text-left pl-3">
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
                        />
                      </div>

                      {/* right btns */}
                      <div className="text-right">
                        <a
                          onClick={handleOnCancel}
                          className="bg-white medium-grey mr-2 rounded-md px-3 py-2 uppercase cursor-pointer"
                        >
                          cancel
                        </a>
                        <a
                          onClick={handleAddQuestion}
                          className="bg-white medium-grey rounded-md px-3 py-2 uppercase cursor-pointer"
                        >
                          continue
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
