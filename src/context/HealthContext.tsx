
import React, { createContext, useContext, useState, ReactNode } from "react";
import { analyzeSymptoms } from "@/services/api";
import { toast } from "sonner";
import { typedSupabase } from "@/integrations/supabase/customClient";
import { HealthAnalysisResult, SupportedLanguage } from "@/types/health";

type HealthContextType = {
  analyzing: boolean;
  result: HealthAnalysisResult | null;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  analyzeSymptomsText: (text: string) => Promise<void>;
  analyzeSymptomsVoice: (audioBlob: Blob) => Promise<void>;
  analyzeSymptomsImage: (imageFile: File) => Promise<void>;
  reset: () => void;
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<HealthAnalysisResult | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("english");

  const analyzeSymptomsText = async (text: string) => {
    try {
      setAnalyzing(true);
      toast.info(language === "english" ? "Analyzing your symptoms..." : "உங்கள் அறிகுறிகளை ஆராய்கிறது...");
      const analysisResult = await analyzeSymptoms(text, "text", language);
      setResult(analysisResult);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error(language === "english" 
        ? "Failed to analyze symptoms. Please try again." 
        : "அறிகுறிகளை ஆராய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeSymptomsVoice = async (audioBlob: Blob) => {
    try {
      setAnalyzing(true);
      toast.info(language === "english" ? "Processing voice recording..." : "குரல் பதிவை செயலாக்குகிறது...");
      
      // Convert audio to base64 for processing
      const reader = new FileReader();
      
      const audioText = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          // In a real app, we'd send the audio for transcription
          // For now, we'll use a simulated transcription
          resolve(language === "english" 
            ? "I have a headache, sore throat, and feeling tired for the past two days."
            : "எனக்கு தலைவலி, தொண்டை வலி மற்றும் கடந்த இரண்டு நாட்களாக சோர்வாக உணர்கிறேன்.");
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      toast.success(language === "english" ? "Voice transcribed successfully" : "குரல் வெற்றிகரமாக எழுத்துருவாக்கப்பட்டது");
      
      // Now analyze the transcribed text
      const analysisResult = await analyzeSymptoms(audioText, "voice", language);
      setResult(analysisResult);
    } catch (error) {
      console.error("Error processing voice:", error);
      toast.error(language === "english" 
        ? "Failed to process voice recording. Please try again or use text input."
        : "குரல் பதிவை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது உரை உள்ளீட்டைப் பயன்படுத்தவும்.");
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeSymptomsImage = async (imageFile: File) => {
    try {
      setAnalyzing(true);
      toast.info(language === "english" ? "Analyzing your image..." : "உங்கள் படத்தை ஆராய்கிறது...");
      
      // Create a description of what's in the image
      // In a real app, this would be done by an image analysis API
      const imageDescription = language === "english"
        ? "The image shows skin with visible redness and small bumps, possibly indicating a rash or allergic reaction."
        : "படத்தில் தோல் தெரியக்கூடிய சிவப்பு நிறம் மற்றும் சிறிய கொப்புளங்கள் காட்டுகிறது, சாத்தியமான தடிப்பு அல்லது ஒவ்வாமை எதிர்வினையைக் குறிக்கிறது.";
      
      // Analyze the image description
      const analysisResult = await analyzeSymptoms(imageDescription, "image", language);
      
      // Add the image URL to the result
      setResult({
        ...analysisResult,
        imageAnalysis: URL.createObjectURL(imageFile)
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error(language === "english" 
        ? "Failed to analyze image. Please try again or use text input."
        : "படத்தை ஆராய முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது உரை உள்ளீட்டைப் பயன்படுத்தவும்.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return (
    <HealthContext.Provider
      value={{
        analyzing,
        result,
        language,
        setLanguage,
        analyzeSymptomsText,
        analyzeSymptomsVoice,
        analyzeSymptomsImage,
        reset
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error("useHealth must be used within a HealthProvider");
  }
  return context;
};
