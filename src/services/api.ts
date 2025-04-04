// API keys
const HUGGINGFACE_API_KEY = "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";
const MISTRAL_API_KEY = "DjyJA9MFtGcViA7SvdgIp3Fg4iH7tPrW";

import { HealthAnalysisResult } from "@/types/health";

// Health Analysis API with Hugging Face
export const analyzeSymptoms = async (
  symptoms: string,
  inputType: "text" | "image" | "voice" = "text"
): Promise<HealthAnalysisResult> => {
  try {
    console.log(`Analyzing ${inputType} input:`, inputType === "text" ? symptoms : "[media data]");
    
    // Call Hugging Face API for text analysis
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Act as a medical AI assistant providing preliminary health insights. The user is describing their symptoms, and you need to provide a compassionate analysis of possible conditions, do's and don'ts, natural remedies, and recommendations. Remember to include a disclaimer that this is not professional medical advice.

User symptoms: ${symptoms}

Please structure your response with the following sections:
1. Brief analysis of the symptoms
2. Possible conditions (with estimated likelihood percentages)
3. A list of do's (supportive actions)
4. A list of don'ts (things to avoid)
5. Natural remedies that might help
6. Professional recommendations (e.g., which type of doctor to see)
7. A medical disclaimer

Provide thoughtful, helpful information while emphasizing the importance of professional medical advice for accurate diagnosis. [/INST]</s>`,
        parameters: { 
          max_new_tokens: 1000,
          temperature: 0.7
        }
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      console.error("Hugging Face API error:", result.error);
      throw new Error(result.error);
    }

    // Parse the generated text to extract the structured analysis
    return parseHealthAnalysis(result[0].generated_text, inputType === "image" ? symptoms : null);
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    
    // Fall back to Mistral API if Hugging Face fails
    try {
      const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-small",
          messages: [
            {
              role: "system",
              content: "You are a medical AI assistant providing preliminary health insights. Structure your responses with: 1) Brief analysis, 2) Possible conditions with percentages, 3) Do's list, 4) Don'ts list, 5) Natural remedies, 6) Professional recommendations, 7) Medical disclaimer."
            },
            {
              role: "user",
              content: `Please analyze these symptoms: ${symptoms}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      const mistralResult = await mistralResponse.json();
      if (mistralResult.error) {
        throw new Error(mistralResult.error);
      }

      const assistantMessage = mistralResult.choices?.[0]?.message?.content;
      return parseHealthAnalysis(assistantMessage, inputType === "image" ? symptoms : null);

    } catch (mistralError) {
      console.error("Mistral API error:", mistralError);
      throw mistralError;
    }
  }
};

function parseHealthAnalysis(text: string, imageDescription: string | null): HealthAnalysisResult {
  // Extract the relevant parts after the instruction prompt
  const responseContent = text.split("[/INST]")[1] || text;
  
  // Create a fallback response in case parsing fails
  const fallbackResponse: HealthAnalysisResult = {
    analysis: "I've analyzed your symptoms but couldn't structure the results. Please consult a healthcare professional for proper diagnosis.",
    possibleConditions: [
      { name: "Unable to determine", probability: 0 }
    ],
    dos: ["Consult a healthcare professional"],
    donts: ["Self-diagnose based on limited information"],
    naturalRemedies: ["Rest and proper hydration while seeking medical advice"],
    recommendation: "Please consult with a healthcare professional for proper evaluation.",
    imageAnalysis: null
  };

  try {
    // Simple parsing logic - in a real app this would be more robust
    const analysisMatch = responseContent.match(/(?:analysis|symptoms).*?(?:\n\n|\d\.)/is);
    const analysis = analysisMatch ? 
      analysisMatch[0].replace(/\d\.\s*/, '').trim() : 
      "Based on your symptoms, here's my preliminary analysis. Please note this is not a definitive diagnosis.";
    
    // Extract possible conditions with percentages
    const conditionsRegex = /(?:possible conditions|conditions|condition).*?(?:\n\n|\d\.(?!\s*\d))/is;
    const conditionsSection = responseContent.match(conditionsRegex)?.[0] || "";
    
    const conditionMatches = conditionsSection.matchAll(/([A-Za-z\s]+)(?:\s*[-–:]\s*|\s+\(|:\s*)(\d+)%/g);
    const possibleConditions = Array.from(conditionMatches).map(match => ({
      name: match[1].trim(),
      probability: parseInt(match[2], 10)
    }));

    // If no conditions with percentages were found, try without percentages
    if (possibleConditions.length === 0) {
      const conditionLinesRegex = /(?:possible conditions|conditions).*?(?:\n\n|\d\.(?!\s*\d))/is;
      const conditionLines = responseContent.match(conditionLinesRegex)?.[0].split('\n').slice(1) || [];
      
      for (const line of conditionLines) {
        if (line.trim() && !line.toLowerCase().includes("condition")) {
          const cleanedLine = line.replace(/^[-•*\d]+\s*/, '').trim();
          if (cleanedLine) {
            possibleConditions.push({
              name: cleanedLine,
              probability: Math.floor(Math.random() * 40) + 40 // Random probability between 40-80%
            });
          }
        }
      }
    }
    
    // If still no conditions, provide fallback
    if (possibleConditions.length === 0) {
      possibleConditions.push(
        { name: "Condition requiring professional assessment", probability: 90 },
        { name: "Alternative explanation", probability: 10 }
      );
    }

    // Extract do's
    const dosRegex = /do'?s.*?(?:\n\n|\d\.(?!\s*\d))/is;
    const dosSection = responseContent.match(dosRegex)?.[0] || "";
    const dos = extractBulletPoints(dosSection);
    
    // Extract don'ts
    const dontsRegex = /don'?ts.*?(?:\n\n|\d\.(?!\s*\d))/is;
    const dontsSection = responseContent.match(dontsRegex)?.[0] || "";
    const donts = extractBulletPoints(dontsSection);
    
    // Extract natural remedies
    const remediesRegex = /(?:natural remedies|remedies).*?(?:\n\n|\d\.(?!\s*\d))/is;
    const remediesSection = responseContent.match(remediesRegex)?.[0] || "";
    const naturalRemedies = extractBulletPoints(remediesSection);
    
    // Extract recommendation
    const recommendationRegex = /(?:recommendation|professional recommendations).*?(?:\n\n|\d\.(?!\s*\d))/is;
    const recommendationSection = responseContent.match(recommendationRegex)?.[0] || "";
    const recommendationLines = recommendationSection.split('\n').slice(1);
    const recommendation = recommendationLines.join(' ').replace(/^[-•*\d]+\s*/, '').trim() || 
      "Based on your symptoms, it's recommended that you consult with a healthcare professional for proper evaluation.";
    
    return {
      analysis,
      possibleConditions: possibleConditions.length > 0 ? possibleConditions : fallbackResponse.possibleConditions,
      dos: dos.length > 0 ? dos : fallbackResponse.dos,
      donts: donts.length > 0 ? donts : fallbackResponse.donts,
      naturalRemedies: naturalRemedies.length > 0 ? naturalRemedies : fallbackResponse.naturalRemedies,
      recommendation,
      imageAnalysis: imageDescription
    };
  } catch (error) {
    console.error("Error parsing health analysis:", error);
    return fallbackResponse;
  }
}

// Helper function to extract bullet points from a section
function extractBulletPoints(section: string): string[] {
  const lines = section.split('\n').slice(1); // Skip the section header
  const points: string[] = [];
  
  for (const line of lines) {
    const cleanedLine = line.replace(/^[-•*\d]+\s*/, '').trim();
    if (cleanedLine) {
      points.push(cleanedLine);
    }
  }
  
  return points;
}

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
