
import React from "react";
import { SupportedLanguage } from "@/types/health";

interface DisclaimerProps {
  language: SupportedLanguage;
}

const Disclaimer = ({ language }: DisclaimerProps) => {
  const translations = {
    disclaimer: language === 'english' 
      ? 'This analysis is provided for informational purposes only, and is not a substitute for professional medical advice, diagnosis, or treatment.'
      : 'இந்த பகுப்பாய்வு தகவல் நோக்கங்களுக்காக மட்டுமே வழங்கப்படுகிறது, மேலும் தொழில்முறை மருத்துவ ஆலோசனை, நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாக அல்ல.',
    important: language === 'english' ? 'Important:' : 'முக்கியம்:',
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <p className="text-sm">
        <strong>{translations.important}</strong> {translations.disclaimer}
      </p>
    </div>
  );
};

export default Disclaimer;
