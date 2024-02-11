import LeftColumn from "@/components/LeftColumn/LeftColumn";
import RightColumnSurvey from "@/components/RightColumnSurvey/RightColumnSurvey";
import { SurveyStatus } from ".prisma/client";
import { SurveyDTO } from "@/types/SurveyDTO";
import { redirect } from "next/navigation";

export default function SurveyCreatePage() {
  const createSurvey = async (formData: FormData) => {
    "use server";
    if (!(formData.get("name") && formData.get("manager"))) {
      return;
    }
    const data: Partial<SurveyDTO["data"]> = {
      name: formData.get("name") as string,
      manager: formData.get("manager") as string,
      introduction: formData.get("introduction") as string,
    };

    const response = await fetch(`${process.env.API_URL}/surveys`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const jsonData = await response.json();

    const { id: surveyId } = jsonData.data;

    return redirect(`/dashboard/surveys/${surveyId}/questions`);
  };

  return (
    <div className="bg-image">
      <div className="py-14 mx-auto w-4/5 h-full">
        <div className="flex h-5/6">
          {/* left column */}
          <LeftColumn />

          {/* right coloumn basic */}
          <RightColumnSurvey
            title="creating a new survey"
            surveyAction={createSurvey}
          />
        </div>
      </div>
    </div>
  );
}
