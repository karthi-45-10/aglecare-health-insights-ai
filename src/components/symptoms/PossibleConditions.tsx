
import React from "react";
import { Progress } from "@/components/ui/progress";
import { SupportedLanguage } from "@/types/health";

interface ConditionType {
  name: string;
  probability: number;
}

interface PossibleConditionsProps {
  conditions: ConditionType[];
  language: SupportedLanguage;
}

const PossibleConditions = ({ conditions, language }: PossibleConditionsProps) => {
  const translations = {
    possibleConditions: language === 'english' ? 'Possible Conditions' : 'சாத்தியமான நிலைமைகள்',
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <div className="bg-blue-100 p-1.5 rounded-full mr-2">
          <svg className="text-agleblue h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {translations.possibleConditions}
      </h2>
      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span>{condition.name}</span>
              <span className="text-sm text-gray-500">{condition.probability}%</span>
            </div>
            <Progress value={condition.probability} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PossibleConditions;
