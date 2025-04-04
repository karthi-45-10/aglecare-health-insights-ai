
import React from "react";
import { SupportedLanguage } from "@/types/health";

interface ResultsHeaderProps {
  language: SupportedLanguage;
}

const ResultsHeader = ({ language }: ResultsHeaderProps) => {
  const translations = {
    healthAnalysis: language === 'english' ? 'Health Analysis' : 'ஆரோக்கிய பகுப்பாய்வு',
  };

  return (
    <div className="flex items-center mb-6">
      <div className="bg-blue-100 p-2 rounded-full mr-3">
        <svg className="text-agleblue h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold">{translations.healthAnalysis}</h1>
    </div>
  );
};

export default ResultsHeader;
