"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormEventHandler } from "react";
import { QuestionDTO, QuestionsDTO } from "@/types/QuestionDTO";
import { useRouter } from "next/navigation";
import { variants } from "@/lib/animations";
import { motion } from "framer-motion";

export default function PublicSurveyQuestionPage() {
  const router = useRouter();
  const { surveyId, questionId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionsDTO["data"]>([]);
  const [question, setQuestion] = useState<QuestionDTO["data"]>();
  const currentQuestionId = Array.isArray(questionId)
    ? questionId[0]
    : questionId;

  const getQuestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/questions`);
      const { data }: QuestionsDTO = await response.json();

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }, [surveyId]);

  const getQuestion = useCallback(
    async (qid: string) => {
      try {
        const response = await fetch(
          `/api/surveys/${surveyId}/questions/${qid}`
        );
        const { data }: QuestionDTO = await response.json();
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    },
    [surveyId]
  );

  useEffect(() => {
    getQuestions();
  }, [surveyId, getQuestions]);

  useEffect(() => {
    if (questionId && questions.length > 0) {
      const index = questions.findIndex((q) => q.id === questionId);
      if (index > -1) {
        setCurrentQuestionIndex(index);
      }
    }
  }, [questionId, questions]);

  useEffect(() => {
    if (currentQuestionId) {
      getQuestion(currentQuestionId);
    }
  }, [currentQuestionId, getQuestion]);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const answer = formData.get("answer") as string;
    const answerEndpoint = `/api/surveys/${surveyId}/questions/${currentQuestionId}/answers`;

    if (answer === "" && !question?.required) {
      if (currentQuestionIndex < questions.length - 1) {
        const nextQuestionId = questions[currentQuestionIndex + 1].id;
        router.push(`/surveys/${surveyId}/questions/${nextQuestionId}`);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else if (answer) {
      try {
        const response = await fetch(answerEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer }),
        });

        if (response.ok) {
          if (currentQuestionIndex < questions.length - 1) {
            const nextQuestionId = questions[currentQuestionIndex + 1].id;
            router.push(`/surveys/${surveyId}/questions/${nextQuestionId}`);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            console.log("Survey completed");
            router.push(`/surveys/${surveyId}/done`);
          }
        } else {
          console.error("Failed to submit answer:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="bg-image">
      <motion.div
        variants={variants}
        initial="initial"
        whileInView="animate"
        className="py-14 flex justify-center items-center mx-auto w-4/5 h-full"
      >
        <motion.div variants={variants} className="flex h-5/6 w-full">
          <div className="w-full">
            <form onSubmit={handleFormSubmit} className="h-full">
              <div className="h-full">
                <div className="content p-8 font-normal">
                  <div className="create-question flex-col flex justify-center h-full text-center rounded-md white-bg-80 py-12 px-8">
                    <h4 className="text-xl davys-grey uppercase mb-5">
                      <span>Question {question?.position! + 1}</span> <br />
                    </h4>
                    <h1 className="mb-5 text-2xl">{question?.text}</h1>
                    <textarea
                      name="answer"
                      className="textarea-inputs-bg w-full rounded-md p-3 text-xl mb-2"
                      cols={20}
                      rows={4}
                      placeholder="ENTER THE ANSWER"
                    ></textarea>
                    {question?.required ? (
                      <p className="text-left uppercase davys-grey">
                        * required
                      </p>
                    ) : (
                      <p className="text-left uppercase davys-grey">
                        * optional
                      </p>
                    )}
                    <div className="flex justify-end items-center mt-4">
                      <button
                        type="submit"
                        className="active-green text-white  text-lg rounded-md px-6 py-2 uppercase cursor-pointer"
                      >
                        next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
