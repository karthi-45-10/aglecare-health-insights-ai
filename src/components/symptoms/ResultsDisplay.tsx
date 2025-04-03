
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHealth } from "@/context/HealthContext";
import { Button } from "@/components/ui/button";
import { Check, X, Leaf } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { typedSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

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
        toast.error(language === 'english' ? 'Failed to save analysis' : 'பகுப்பாய்வைச் சேமிக்க முடியவில்லை');
        throw error;
      }
      
      setSavedToDatabase(true);
      toast.success(
        language === 'english' 
          ? 'Analysis saved to your health history'
          : 'பகுப்பாய்வு உங்கள் ஆரோக்கிய வரலாற்றில் சேமிக்கப்பட்டது'
      );
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

  // Translations
  const translations = {
    healthAnalysis: language === 'english' ? 'Health Analysis' : 'ஆரோக்கிய பகுப்பாய்வு',
    basedOnImage: language === 'english' ? 'Based on the image you provided:' : 'நீங்கள் வழங்கிய படத்தின் அடிப்படையில்:',
    imageAnalysis: language === 'english' ? 'Image analysis included in results' : 'பகுப்பாய்வில் படம் சேர்க்கப்பட்டுள்ளது',
    doctorConsult: language === 'english' ? 'Doctor Consultation Recommended' : 'மருத்துவர் ஆலோசனை பரிந்துரைக்கப்படுகிறது',
    specialist: language === 'english' ? 'Suggested specialist:' : 'பரிந்துரைக்கப்பட்ட நிபுணர்:',
    dermatologist: language === 'english' ? 'Dermatologist' : 'தோல் மருத்துவர்',
    possibleConditions: language === 'english' ? 'Possible Conditions' : 'சாத்தியமான நிலைமைகள்',
    dos: language === 'english' ? "Do's" : 'செய்யவேண்டியவை',
    donts: language === 'english' ? "Don'ts" : 'செய்யக்கூடாதவை',
    naturalRemedies: language === 'english' ? 'Natural Remedies' : 'இயற்கை தீர்வுகள்',
    remediesNote: language === 'english' 
      ? 'Note: These natural remedies are suggestions and not a replacement for proper medical treatment.' 
      : 'குறிப்பு: இந்த இயற்கை தீர்வுகள் ஆலோசனைகள் மட்டுமே, சரியான மருத்துவ சிகிச்சைக்கு மாற்று அல்ல.',
    recommendation: language === 'english' ? 'Recommendation' : 'பரிந்துரை',
    disclaimer: language === 'english' 
      ? 'This analysis is provided for informational purposes only, and is not a substitute for professional medical advice, diagnosis, or treatment.'
      : 'இந்த பகுப்பாய்வு தகவல் நோக்கங்களுக்காக மட்டுமே வழங்கப்படுகிறது, மேலும் தொழில்முறை மருத்துவ ஆலோசனை, நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாக அல்ல.',
    important: language === 'english' ? 'Important:' : 'முக்கியம்:',
    startOver: language === 'english' ? 'Start Over' : 'மீண்டும் தொடங்கவும்',
    createAccount: language === 'english' ? 'Create Account to Save Results' : 'முடிவுகளைச் சேமிக்க கணக்கை உருவாக்கவும்'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <svg className="text-agleblue h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold">{translations.healthAnalysis}</h1>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p>{result.analysis}</p>
        {result.imageAnalysis && (
          <div className="mt-4">
            <p className="font-medium mb-2">{translations.basedOnImage}</p>
            <div className="flex items-center">
              <img 
                src={result.imageAnalysis}
                alt="Analyzed image" 
                className="w-20 h-20 object-cover rounded-md border"
              />
              <p className="ml-4 text-sm italic">{translations.imageAnalysis}</p>
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
              <p className="text-sm font-medium">{translations.doctorConsult}</p>
              <p className="text-xs text-yellow-700 mt-1">
                {translations.specialist} {translations.dermatologist}
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
            {translations.possibleConditions}
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
            {translations.dos}
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
            {translations.donts}
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
            {translations.naturalRemedies}
          </h2>
          <div className="space-y-2">
            {result.naturalRemedies.map((remedy, index) => (
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
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{translations.recommendation}</h2>
        <p>{result.recommendation}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm">
          <strong>{translations.important}</strong> {translations.disclaimer}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={startNewAnalysis} className="border border-agleblue text-agleblue hover:bg-blue-50 font-medium px-6 py-2.5 rounded-full transition-all">
          {translations.startOver}
        </Button>
        
        {showCreateAccountPrompt && (
          <Button 
            onClick={createAccount} 
            className="bg-agleblue hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full transition-all"
          >
            {translations.createAccount}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
