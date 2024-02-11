"use client";
import React from "react";
import { usePathname } from "next/navigation";

const leftColumnContent = [
  {
    title: "basis",
  },
  {
    title: "questions",
  },
];

export default function LeftColumn() {
  const pathname = usePathname().substring(1);

  const pathnameList = pathname.split("/");
  const lastElement = pathnameList.at(-1);

  const handleActiveRoute = (title: string) => {
    if (lastElement === "create" && title === "basis") {
      return "active-green";
    } else if (lastElement === "questions" && title === "questions") {
      return "active-green";
    } else if (
      lastElement !== "create" &&
      lastElement !== "questions" &&
      title === "basis"
    ) {
      return "active-green";
    }

    return "";
  };

  const handleSpanColor = (title: string) => {
    if (lastElement === "questions" && title === "questions") {
      return "text-white";
    } else if (lastElement === "create" && title === "basis") {
      return "text-white";
    } else if (
      lastElement !== "create" &&
      lastElement !== "questions" &&
      title === "basis"
    ) {
      return "text-white";
    }

    return "davys-grey";
  };

  return (
    <div className="w-1/3 mr-10">
      <h1 className="dim-gray mb-12 text-center text-4xl">KFK Surveys</h1>

      <div className="relative h-full">
        <div className="content px-4 pt-4">
          <h3 className="dim-gray text-2xl uppercase text-center mb-5">
            survey info
          </h3>

          {leftColumnContent.map((typ, index) => {
            return (
              <div
                key={index}
                className={`flex justify-center white-bg-80 uppercase rounded-2xl py-2 px-5 mt-4 ${handleActiveRoute(
                  typ.title
                )}`}
              >
                <span className={`${handleSpanColor(typ.title)}`}>
                  {typ.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
