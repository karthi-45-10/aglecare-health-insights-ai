
import React from "react";
import { Leaf } from "lucide-react";
import { SupportedLanguage } from "@/types/health";

interface NaturalRemediesProps {
  remedies: string[];
  language: SupportedLanguage;
}

const NaturalRemedies = ({ remedies, language }: NaturalRemediesProps) => {
  const translations = {
    naturalRemedies: language === 'english' ? 'Natural Remedies' : 'இயற்கை தீர்வுகள்',
    remediesNote: language === 'english' 
      ? 'Note: These natural remedies are suggestions and not a replacement for proper medical treatment.' 
      : 'குறிப்பு: இந்த இயற்கை தீர்வுகள் ஆலோசனைகள் மட்டுமே, சரியான மருத்துவ சிகிச்சைக்கு மாற்று அல்ல.',
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <div className="bg-green-100 p-1.5 rounded-full mr-2">
          <Leaf size={16} className="text-green-500" />
        </div>
        {translations.naturalRemedies}
      </h2>
      <div className="space-y-2">
        {remedies.map((remedy, index) => (
          <div key={index} className="flex items-start">
            <Leaf size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span>{remedy}</span>
          </div>
        ))}
        <p className="text-xs text-gray-500 mt-4">
          {translations.remediesNote}
        </p>
      </div>
    </div>
  );
};

export default NaturalRemedies;
