
import React from "react";
import { SupportedLanguage } from "@/types/health";

interface AnalysisSummaryProps {
  analysis: string;
  imageAnalysis: string | null;
  language: SupportedLanguage;
}

const AnalysisSummary = ({ analysis, imageAnalysis, language }: AnalysisSummaryProps) => {
  const translations = {
    basedOnImage: language === 'english' ? 'Based on the image you provided:' : 'நீங்கள் வழங்கிய படத்தின் அடிப்படையில்:',
    imageAnalysis: language === 'english' ? 'Image analysis included in results' : 'பகுப்பாய்வில் படம் சேர்க்கப்பட்டுள்ளது',
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-6">
      <p>{analysis}</p>
      {imageAnalysis && (
        <div className="mt-4">
          <p className="font-medium mb-2">{translations.basedOnImage}</p>
          <div className="flex items-center">
            <img 
              src={imageAnalysis}
              alt="Analyzed image" 
              className="w-20 h-20 object-cover rounded-md border"
            />
            <p className="ml-4 text-sm italic">{translations.imageAnalysis}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSummary;
