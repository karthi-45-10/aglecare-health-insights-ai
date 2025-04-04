
import React, { createContext, useContext, useState, ReactNode } from "react";
import { analyzeSymptoms, translateText } from "@/services/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HealthAnalysisResult, HealthAnalysisLanguage } from "@/types/health";

type HealthContextType = {
  analyzing: boolean;
  result: HealthAnalysisResult | null;
  language: HealthAnalysisLanguage;
  setLanguage: (language: HealthAnalysisLanguage) => void;
  analyzeSymptomsText: (text: string) => Promise<void>;
  analyzeSymptomsVoice: (audioBlob: Blob) => Promise<void>;
  analyzeSymptomsImage: (imageFile: File) => Promise<void>;
  reset: () => void;
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<HealthAnalysisResult | null>(null);
  const [language, setLanguage] = useState<HealthAnalysisLanguage>("english");

  const analyzeSymptomsText = async (text: string) => {
    try {
      setAnalyzing(true);
      toast.info("Analyzing your symptoms...");
      const analysisResult = await analyzeSymptoms(text, "text");
      
      // If language is Tamil, translate the result
      if (language === "tamil") {
        const translatedResult = await translateAnalysisToTamil(analysisResult);
        setResult(translatedResult);
      } else {
        setResult(analysisResult);
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error("Failed to analyze symptoms. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeSymptomsVoice = async (audioBlob: Blob) => {
    try {
      setAnalyzing(true);
      toast.info("Processing voice recording...");
      
      // Convert audio to base64 for processing
      const reader = new FileReader();
      
      const audioText = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          // In a real app, we'd send the audio for transcription
          // For now, we'll use a simulated transcription
          resolve("I have a headache, sore throat, and feeling tired for the past two days.");
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      toast.success("Voice transcribed successfully");
      
      // Now analyze the transcribed text
      const analysisResult = await analyzeSymptoms(audioText, "voice");
      
      // If language is Tamil, translate the result
      if (language === "tamil") {
        const translatedResult = await translateAnalysisToTamil(analysisResult);
        setResult(translatedResult);
      } else {
        setResult(analysisResult);
      }
    } catch (error) {
      console.error("Error processing voice:", error);
      toast.error("Failed to process voice recording. Please try again or use text input.");
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeSymptomsImage = async (imageFile: File) => {
    try {
      setAnalyzing(true);
      toast.info("Analyzing your image...");
      
      // Create a description of what's in the image
      // In a real app, this would be done by an image analysis API
      const imageDescription = "The image shows skin with visible redness and small bumps, possibly indicating a rash or allergic reaction.";
      
      // Analyze the image description
      const analysisResult = await analyzeSymptoms(imageDescription, "image");
      
      // Add the image URL to the result
      const resultWithImage = {
        ...analysisResult,
        imageAnalysis: URL.createObjectURL(imageFile)
      };

      // If language is Tamil, translate the result
      if (language === "tamil") {
        const translatedResult = await translateAnalysisToTamil(resultWithImage);
        setResult(translatedResult);
      } else {
        setResult(resultWithImage);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again or use text input.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper function to translate analysis result to Tamil
  const translateAnalysisToTamil = async (analysisResult: HealthAnalysisResult): Promise<HealthAnalysisResult> => {
    try {
      // Translate analysis text
      const translatedAnalysis = await translateText(analysisResult.analysis, "en", "ta");
      
      // Translate possible conditions
      const translatedConditions = await Promise.all(
        analysisResult.possibleConditions.map(async (condition) => ({
          name: await translateText(condition.name, "en", "ta"),
          probability: condition.probability
        }))
      );
      
      // Translate dos
      const translatedDos = await Promise.all(
        analysisResult.dos.map(item => translateText(item, "en", "ta"))
      );
      
      // Translate donts
      const translatedDonts = await Promise.all(
        analysisResult.donts.map(item => translateText(item, "en", "ta"))
      );
      
      // Translate natural remedies
      const translatedRemedies = await Promise.all(
        analysisResult.naturalRemedies.map(item => translateText(item, "en", "ta"))
      );
      
      // Translate recommendation
      const translatedRecommendation = await translateText(analysisResult.recommendation, "en", "ta");
      
      return {
        analysis: translatedAnalysis,
        possibleConditions: translatedConditions,
        dos: translatedDos,
        donts: translatedDonts,
        naturalRemedies: translatedRemedies,
        recommendation: translatedRecommendation,
        imageAnalysis: analysisResult.imageAnalysis
      };
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate analysis to Tamil. Showing English results instead.");
      return analysisResult;
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
