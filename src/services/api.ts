
// API integration services
import { HealthAnalysisResult } from "@/types/health";
import { typedSupabase } from "@/integrations/supabase/customClient";

// Health Analysis API with Supabase Edge Function
export const analyzeSymptoms = async (
  symptoms: string,
  inputType: "text" | "image" | "voice" = "text",
  language: "english" | "tamil" = "english"
): Promise<HealthAnalysisResult> => {
  try {
    console.log(`Analyzing ${inputType} input in ${language}:`, inputType === "text" ? symptoms : "[media data]");
    
    // Call our Supabase Edge Function
    const { data, error } = await typedSupabase.functions.invoke('analyze-symptoms', {
      body: { symptoms, inputType, language },
    });

    if (error) {
      console.error("Error calling analyze-symptoms function:", error);
      throw error;
    }

    return data as HealthAnalysisResult;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
};

// Function to translate text using MyMemory API (for multilingual support)
export const translateText = async (text: string, fromLang = "en", toLang = "en") => {
  if (fromLang === toLang) return text;
  
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
    );
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};
