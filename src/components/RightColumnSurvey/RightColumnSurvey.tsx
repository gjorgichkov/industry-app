"use client";
import Image from "next/image";

interface SurveyFormProps {
  title: string;
  surveyAction: (formData: FormData) => void;
}

export default function RightColumnSurvey(props: SurveyFormProps) {
  return (
    <div className="w-2/3">
      <form action={props.surveyAction} className="h-full">
        <div className="continue-btn p-2 mb-12 text-right">
          <div className={`dark-green inline p-2 rounded-md`}>
            <button type="submit" className="text-white mr-1 uppercase">
              create
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
                className="w-full  rounded-md survey-inputs mb-2 pl-1"
              ></textarea>
              <p
                className="uppercase text-center medium-grey"
                style={{ fontSize: "10px" }}
              >
                Enter the following data and continue with the further creation
                process enter the following data and continue with the further
                creation process enter the following data and continue with the
                further creation process
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
