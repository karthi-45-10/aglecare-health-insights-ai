
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHealth } from "@/context/HealthContext";
import { Button } from "@/components/ui/button";
import { Check, X, Leaf, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { typedSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";
import { HealthAnalysisLanguage } from "@/types/health";

const ResultsDisplay = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, language } = useHealth();
  const [showCreateAccountPrompt, setShowCreateAccountPrompt] = useState(!user);
  const [savedToDatabase, setSavedToDatabase] = useState(false);

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
  
  // Save analysis to Supabase if user is logged in
  const saveAnalysis = async () => {
    if (!user || !result || savedToDatabase) return;
    
    try {
      // Define the data to insert
      const analysisData = {
        user_id: user.id,
        symptoms: 'User symptoms',
        input_type: result.imageAnalysis ? 'image' : 'text',
        analysis: result.analysis,
        recommendation: result.recommendation
      };
      
      const { error } = await typedSupabase
        .from('health_analyses')
        .insert(analysisData);
      
      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to save analysis');
        throw error;
      }
      
      setSavedToDatabase(true);
      toast.success('Analysis saved to your health history');
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };
  
  // Use useEffect to call saveAnalysis when component mounts
  useEffect(() => {
    if (user && result && !savedToDatabase) {
      saveAnalysis();
    }
  }, [user, result]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg className="text-agleblue h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Health Analysis</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-gray-500" />
          <span className="text-sm font-medium">
            {language === "english" ? "English" : "தமிழ்"}
          </span>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p>{result.analysis}</p>
        {result.imageAnalysis && (
          <div className="mt-4">
            <p className="font-medium mb-2">Based on the image you provided:</p>
            <div className="flex items-center">
              <img 
                src={result.imageAnalysis}
                alt="Analyzed image" 
                className="w-20 h-20 object-cover rounded-md border"
              />
              <p className="ml-4 text-sm italic">Image analysis included in results</p>
            </div>
          </div>
        )}
      </div>

      {result.recommendation.includes("specialist") && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Doctor Consultation Recommended</p>
              <p className="text-xs text-yellow-700 mt-1">
                Suggested specialist: Dermatologist
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <div className="bg-blue-100 p-1.5 rounded-full mr-2">
              <svg className="text-agleblue h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Possible Conditions
          </h2>
          <div className="space-y-4">
            {result.possibleConditions.map((condition, index) => (
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

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <div className="bg-green-100 p-1.5 rounded-full mr-2">
              <Check size={16} className="text-green-500" />
            </div>
            Do's
          </h2>
          <ul className="space-y-2">
            {result.dos.map((item, index) => (
              <li key={index} className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <div className="bg-red-100 p-1.5 rounded-full mr-2">
              <X size={16} className="text-red-500" />
            </div>
            Don'ts
          </h2>
          <ul className="space-y-2">
            {result.donts.map((item, index) => (
              <li key={index} className="flex items-start">
                <X size={16} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <div className="bg-green-100 p-1.5 rounded-full mr-2">
              <Leaf size={16} className="text-green-500" />
            </div>
            Natural Remedies
          </h2>
          <div className="space-y-2">
            {result.naturalRemedies.map((remedy, index) => (
              <div key={index} className="flex items-start">
                <Leaf size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>{remedy}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-4">
              Note: These natural remedies are suggestions and not a replacement for proper medical treatment.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Recommendation</h2>
        <p>{result.recommendation}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm">
          <strong>Important:</strong> This analysis is provided for informational purposes only, and is not a substitute for 
          professional medical advice, diagnosis, or treatment.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={startNewAnalysis} className="border border-agleblue text-agleblue hover:bg-blue-50 font-medium px-6 py-2.5 rounded-full transition-all">
          Start Over
        </Button>
        
        {showCreateAccountPrompt && (
          <Button 
            onClick={createAccount} 
            className="bg-agleblue hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full transition-all"
          >
            Create Account to Save Results
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
