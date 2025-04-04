
import React from "react";
import { SupportedLanguage } from "@/types/health";

interface RecommendationProps {
  recommendation: string;
  language: SupportedLanguage;
}

const Recommendation = ({ recommendation, language }: RecommendationProps) => {
  const translations = {
    recommendation: language === 'english' ? 'Recommendation' : 'பரிந்துரை',
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{translations.recommendation}</h2>
      <p>{recommendation}</p>
    </div>
  );
};

export default Recommendation;
