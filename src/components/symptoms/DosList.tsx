
import React from "react";
import { Check } from "lucide-react";
import { SupportedLanguage } from "@/types/health";

interface DosListProps {
  items: string[];
  language: SupportedLanguage;
}

const DosList = ({ items, language }: DosListProps) => {
  const translations = {
    dos: language === 'english' ? "Do's" : 'செய்யவேண்டியவை',
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <div className="bg-green-100 p-1.5 rounded-full mr-2">
          <Check size={16} className="text-green-500" />
        </div>
        {translations.dos}
      </h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DosList;
