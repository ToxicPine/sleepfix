"use client";

import React from "react";
import { HeroHeader } from "@/components/sections/title-section";
import { QuickStartGuide } from "@/components/sections/quick-start-guide";
import {
  HowItWorksSection,
  MedicalDisclaimerSection,
  AcknowledgementsSection,
} from "@/components/sections/footer-sections";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full overflow-y-scroll">
      <div className="max-w-4xl md:max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-12 lg:p-8 lg:py-24 flex flex-col gap-6 md:gap-8">
        <HeroHeader
          title="Vitamin C Eliminates The Insomnia Caused By ADHD Medication"
          subtitle="I'm not a doctor, but I'm pretty sure this is a thing..."
        />

        <QuickStartGuide />

        <Link
          href="/calculator"
          className="flex items-center justify-center mt-2 sm:mt-6 mb-8 w-full cursor-pointer sm:max-w-sm mx-auto bg-linear-to-br/oklch from-sky-600 to-blue-600 text-white p-4 rounded-2xl shadow-xl hover:bg-linear-to-br/oklch hover:from-sky-700 hover:to-blue-700 transition-all font-semibold text-lg duration-300"
        >
          Learn How To Get Your Sleep Back
        </Link>

        <h2 className="w-full text-2xl md:text-3xl text-gray-800 font-semibold sm:text-center">
          Why Vitamin C Works
        </h2>

        <HowItWorksSection />
        <MedicalDisclaimerSection />
        <AcknowledgementsSection />
      </div>
    </div>
  );
}
