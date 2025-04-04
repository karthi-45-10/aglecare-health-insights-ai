
// Health-related type definitions
export interface HealthAnalysisResult {
  analysis: string;
  possibleConditions: Array<{
    name: string;
    probability: number;
  }>;
  dos: string[];
  donts: string[];
  naturalRemedies: string[];
  recommendation: string;
  imageAnalysis: string | null;
}

// Database types for health analyses
export interface HealthAnalysisRecord {
  id: string;
  user_id: string;
  symptoms: string;
  input_type: string;
  analysis: string;
  recommendation: string | null;
  created_at: string;
}

// Language options for health analysis
export type HealthAnalysisLanguage = "english" | "tamil";
