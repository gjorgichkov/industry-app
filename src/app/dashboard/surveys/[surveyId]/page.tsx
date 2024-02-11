import LeftColumn from "@/components/LeftColumn/LeftColumn";
import RightColumnEditSurvey from "@/components/RightColumnEditSurvey/RightColumnEditSurvey";
import { SurveyDTO } from "@/types/SurveyDTO";
import { SurveyStatus } from "@prisma/client";
import { redirect } from "next/navigation";

const getSurveyById = async (id: string): Promise<SurveyDTO> => {
  const response = await fetch(`${process.env.API_URL}/surveys/${id}`);
  return response.json();
};

type SurveyEditPageParams = {
  params: {
    surveyId: string;
  };
};

export default async function SurveyEditPage({
  params: { surveyId },
}: SurveyEditPageParams) {
  const { data: survey } = await getSurveyById(surveyId);
  const title = "Editing survey";

  const updateSurvey = async (formData: FormData) => {
    "use server";
    const data: Partial<SurveyDTO["data"]> = {
      name: formData.get("name") as string,
      manager: formData.get("manager") as string,
      introduction: formData.get("introduction") as string,
      status: formData.get("status") as SurveyStatus,
    };

    const response = await fetch(`${process.env.API_URL}/surveys/${surveyId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (formData.get("status") === SurveyStatus.FINISHED) {
      return redirect(`/dashboard/reports/${surveyId}`);
    }
  };

  return (
    <div className="bg-image">
      <div className="py-14 mx-auto w-4/5 h-full">
        <div className="flex h-5/6">
          {/* left column */}
          <LeftColumn />

          {/* right coloumn basic */}
          <RightColumnEditSurvey title={title} surveyAction={updateSurvey} />
        </div>
      </div>
    </div>
  );
}
