
import React from "react";
import { Button } from "@/components/ui/button";
import { SupportedLanguage } from "@/types/health";

interface ResultActionsProps {
  showCreateAccountPrompt: boolean;
  language: SupportedLanguage;
  onStartOver: () => void;
  onCreateAccount: () => void;
}

const ResultActions = ({
  showCreateAccountPrompt,
  language,
  onStartOver,
  onCreateAccount
}: ResultActionsProps) => {
  const translations = {
    startOver: language === 'english' ? 'Start Over' : 'மீண்டும் தொடங்கவும்',
    createAccount: language === 'english' ? 'Create Account to Save Results' : 'முடிவுகளைச் சேமிக்க கணக்கை உருவாக்கவும்'
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        onClick={onStartOver} 
        className="border border-agleblue text-agleblue hover:bg-blue-50 font-medium px-6 py-2.5 rounded-full transition-all"
      >
        {translations.startOver}
      </Button>
      
      {showCreateAccountPrompt && (
        <Button 
          onClick={onCreateAccount} 
          className="bg-agleblue hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full transition-all"
        >
          {translations.createAccount}
        </Button>
      )}
    </div>
  );
};

export default ResultActions;
