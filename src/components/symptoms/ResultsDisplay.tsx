
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealth } from "@/context/HealthContext";
import { useAuth } from "@/context/AuthContext";

import ResultsHeader from "./ResultsHeader";
import AnalysisSummary from "./AnalysisSummary";
import SpecialistRecommendation from "./SpecialistRecommendation";
import PossibleConditions from "./PossibleConditions";
import DosList from "./DosList";
import DontsList from "./DontsList";
import NaturalRemedies from "./NaturalRemedies";
import Recommendation from "./Recommendation";
import Disclaimer from "./Disclaimer";
import ResultActions from "./ResultActions";
import { useAnalysisStorage } from "./useAnalysisStorage";

const ResultsDisplay = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, language } = useHealth();
  const [showCreateAccountPrompt] = useState(!user);
  
  // Use the extracted hook for database operations
  useAnalysisStorage({ user, result, language });

  if (!result) {
    navigate("/symptoms");
    return null;
  }

  const startNewAnalysis = () => {
    navigate("/symptoms");
  };

  const createAccount = () => {
    navigate("/signup");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ResultsHeader language={language} />
      <AnalysisSummary 
        analysis={result.analysis}
        imageAnalysis={result.imageAnalysis}
        language={language}
      />
      <SpecialistRecommendation 
        recommendation={result.recommendation} 
        language={language} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PossibleConditions 
          conditions={result.possibleConditions} 
          language={language} 
        />
        <DosList 
          items={result.dos} 
          language={language} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DontsList 
          items={result.donts} 
          language={language} 
        />
        <NaturalRemedies 
          remedies={result.naturalRemedies} 
          language={language} 
        />
      </div>

      <Recommendation 
        recommendation={result.recommendation} 
        language={language} 
      />
      
      <Disclaimer language={language} />

      <ResultActions 
        showCreateAccountPrompt={showCreateAccountPrompt}
        language={language}
        onStartOver={startNewAnalysis}
        onCreateAccount={createAccount}
      />
    </div>
  );
};

export default ResultsDisplay;
