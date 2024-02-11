"use client";
import Image from "next/image";
import { SurveyDTO } from "@/types/SurveyDTO";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SurveyFormProps {
  title: string;
  surveyAction: (formData: FormData) => void;
}

export default function RightColumnEditSurvey(props: SurveyFormProps) {
  const [survey, setSurvey] = useState<SurveyDTO["data"]>();
  const { surveyId } = useParams();

  const getSurvey = useCallback(async () => {
    const response = await fetch(`/api/surveys/${surveyId}`);
    const { data } = await response.json();
    setSurvey(data);
  }, [surveyId]);

  useEffect(() => {
    getSurvey();
  }, [surveyId, getSurvey]);

  return (
    <div className="w-2/3">
      <div className="continue-btn p-2 mb-12 text-right">
        <div className={`dark-green inline p-2 rounded-md`}>
          <Link href={`/dashboard/surveys/${survey?.id}/questions`}>
            <button className="text-white mr-1 uppercase">
              continue
              <Image
                src="/icons/rightArrow.png"
                alt="right arrow"
                className="right-arrow inline"
                width={16}
                height={16}
              />
            </button>
          </Link>
        </div>
      </div>
      <form action={props.surveyAction} className="h-full">
        <div className="relative h-full">
          <div className="content p-8 font-normal">
            <div className="new-survey rounded-md h-full white-bg-80 py-3 px-8">
              <h4 className="text-center text-3xl uppercase mb-2">
                {props.title}
              </h4>
              <p className="text-center uppercase text-xs medium-grey mb-10">
                Enter the following data and continue with the further creation
                process
              </p>
              <label
                htmlFor="survey-name"
                className="uppercase text-base mb-2 block medium-grey"
              >
                enter the name of survey
              </label>
              <textarea
                name="name"
                id="survey-name"
                cols={4}
                rows={2}
                className="w-full rounded-md survey-inputs mb-2 pl-1"
                defaultValue={survey?.name}
              ></textarea>
              <label
                htmlFor="survey-message"
                className="uppercase text-base mb-2 block medium-grey"
              >
                enter the introductory message
              </label>
              <textarea
                name="introduction"
                id="survey-message"
                cols={4}
                rows={4}
                className="w-full rounded-md survey-inputs mb-2 pl-1"
                defaultValue={survey?.introduction!}
              ></textarea>
              <label
                htmlFor="survey-email"
                className="uppercase text-base mb-2 block medium-grey"
              >
                enter the admin email
              </label>
              <textarea
                name="manager"
                id="survey-email"
                cols={4}
                rows={2}
                className="w-full rounded-md survey-inputs mb-2 pl-1"
                defaultValue={survey?.manager}
              ></textarea>
              <div className="flex justify-between items-center mt-3">
                <div>
                  <label
                    htmlFor="status"
                    className="uppercase text-base mr-3  medium-grey"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-25"
                    defaultValue={survey?.status}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="FINISHED">Finished</option>
                  </select>{" "}
                </div>
                <div className="continue-btn text-right">
                  <div className={`dark-green inline p-2 rounded-md`}>
                    <button type="submit" className="text-white mr-1 uppercase">
                      save changes
                      <Image
                        src="/icons/rightArrow.png"
                        alt="right arrow"
                        className="right-arrow inline ml-1"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
