"use client";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { variants } from "@/lib/animations";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "@/../public/lottie/next-app.json";

export default function PublicSurveyQuestionPage() {
  return (
    <div className="bg-image">
      <motion.div
        className="py-14 flex justify-center items-center mx-auto w-4/5 h-full"
        variants={variants}
        initial="initial"
        whileInView="animate"
      >
        <div className="flex h-5/6 w-full">
          <div className="w-full">
            <div className="h-full">
              <div className="content p-8 font-normal">
                <div className="create-question  flex-col flex justify-center items-center h-full  rounded-md white-bg-80 py-12 px-8 text-5xl uppercase">
                  <Lottie
                    animationData={animationData}
                    className="flex justify-center items-center inline-block scale-150"
                    loop={true}
                  />

                  <h1 className="davys-grey text-center text-2xl sm:text-5xl mt-2">
                    thanks for participating!
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
