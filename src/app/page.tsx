"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/surveys/create");
  }, [router]);

  return null;
};

export default Home;
