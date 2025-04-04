
import React from "react";
import { X } from "lucide-react";
import { SupportedLanguage } from "@/types/health";

interface DontsListProps {
  items: string[];
  language: SupportedLanguage;
}

const DontsList = ({ items, language }: DontsListProps) => {
  const translations = {
    donts: language === 'english' ? "Don'ts" : 'செய்யக்கூடாதவை',
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <div className="bg-red-100 p-1.5 rounded-full mr-2">
          <X size={16} className="text-red-500" />
        </div>
        {translations.donts}
      </h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <X size={16} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DontsList;
