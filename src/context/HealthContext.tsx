
import React, { createContext, useContext, useState, ReactNode } from "react";
import { analyzeSymptoms, HealthAnalysisResult } from "@/services/api";
import { toast } from "sonner";

type HealthContextType = {
  analyzing: boolean;
  result: HealthAnalysisResult | null;
  analyzeSymptomsText: (text: string) => Promise<void>;
  analyzeSymptomsVoice: (audioBlob: Blob) => Promise<void>;
  analyzeSymptomsImage: (imageFile: File) => Promise<void>;
  reset: () => void;
};

const initialResult: HealthAnalysisResult = {
  analysis: "",
  possibleConditions: [],
  dos: [],
  donts: [],
  naturalRemedies: [],
  recommendation: "",
  imageAnalysis: null
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<HealthAnalysisResult | null>(null);

  const analyzeSymptomsText = async (text: string) => {
    try {
      setAnalyzing(true);
      toast.info("Analyzing your symptoms...");
      const analysisResult = await analyzeSymptoms(text, "text");
      setResult(analysisResult);
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
      
      // In a real app, we'd send the audio for transcription first
      // For demo purposes, we'll simulate a transcription delay and then use a default message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transcribedText = "I have a headache, sore throat, and feeling tired for the past two days.";
      toast.success("Voice transcribed successfully");
      
      // Now analyze the transcribed text
      const analysisResult = await analyzeSymptoms(transcribedText, "voice");
      setResult(analysisResult);
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
      
      // In a real app, we'd send the image for analysis
      // For demo purposes, we'll simulate an image analysis delay and then use a default response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResult = await analyzeSymptoms(
        "The image shows a rash on skin with redness and small bumps", 
        "image"
      );
      
      // Add the image URL to the result
      setResult({
        ...analysisResult,
        imageAnalysis: URL.createObjectURL(imageFile)
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again or use text input.");
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
