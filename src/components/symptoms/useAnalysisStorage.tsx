
import { useState, useEffect } from "react";
import { typedSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";
import { HealthAnalysisResult, SupportedLanguage } from "@/types/health";
import { User } from "@supabase/supabase-js";

interface UseAnalysisStorageProps {
  user: User | null;
  result: HealthAnalysisResult | null;
  language: SupportedLanguage;
}

export const useAnalysisStorage = ({ user, result, language }: UseAnalysisStorageProps) => {
  const [savedToDatabase, setSavedToDatabase] = useState(false);

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

  return { savedToDatabase };
};
