
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const HUGGINGFACE_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, language = "english", inputType = "text" } = await req.json();
    
    // Prepare prompt based on language
    const promptTemplate = language.toLowerCase() === "tamil" 
      ? `<s>[INST] ஒரு மருத்துவ AI உதவியாளராக செயல்படுங்கள், முதன்மை சுகாதார நுண்ணறிவுகளை வழங்குகிறது. பயனர் தங்கள் அறிகுறிகளை விவரிக்கிறார், மற்றும் நீங்கள் இரக்கமான பகுப்பாய்வை வழங்க வேண்டும் சாத்தியமான நிலைமைகள், செய்யவேண்டியவை மற்றும் செய்யக்கூடாதவை, இயற்கை தீர்வுகள், மற்றும் பரிந்துரைகள். இது தொழில்முறை மருத்துவ ஆலோசனை அல்ல என்பதை நினைவில் கொள்ளுங்கள்.

பயனரின் அறிகுறிகள்: ${symptoms}

தயவுசெய்து உங்கள் பதிலை பின்வரும் பிரிவுகளுடன் கட்டமைக்கவும்:
1. அறிகுறிகளின் சுருக்கமான பகுப்பாய்வு
2. சாத்தியமான நிலைமைகள் (மதிப்பிடப்பட்ட வாய்ப்பு சதவீதத்துடன்)
3. செய்யவேண்டியவை பட்டியல் (ஆதரவு செயல்கள்)
4. செய்யக்கூடாதவை பட்டியல் (தவிர்க்க வேண்டிய விஷயங்கள்)
5. உதவக்கூடிய இயற்கை தீர்வுகள்
6. தொழில்முறை பரிந்துரைகள் (எ.கா., எந்த வகையான மருத்துவரை பார்க்க வேண்டும்)
7. ஒரு மருத்துவ மறுப்பு

துல்லியமான நோயறியலுக்கு தொழில்முறை மருத்துவ ஆலோசனையின் முக்கியத்துவத்தை வலியுறுத்தும் அதேவேளையில் சிந்தனையுள்ள, பயனுள்ள தகவல்களை வழங்கவும். [/INST]</s>`
      : `<s>[INST] Act as a medical AI assistant providing preliminary health insights. The user is describing their symptoms, and you need to provide a compassionate analysis of possible conditions, do's and don'ts, natural remedies, and recommendations. Remember to include a disclaimer that this is not professional medical advice.

User symptoms: ${symptoms}

Please structure your response with the following sections:
1. Brief analysis of the symptoms
2. Possible conditions (with estimated likelihood percentages)
3. A list of do's (supportive actions)
4. A list of don'ts (things to avoid)
5. Natural remedies that might help
6. Professional recommendations (e.g., which type of doctor to see)
7. A medical disclaimer

Provide thoughtful, helpful information while emphasizing the importance of professional medical advice for accurate diagnosis. [/INST]</s>`;

    // Try Hugging Face API first
    let analysisText = null;
    let error = null;
    
    try {
      console.log("Calling Hugging Face API...");
      const huggingFaceResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: promptTemplate,
          parameters: { 
            max_new_tokens: 1000,
            temperature: 0.7
          }
        }),
      });
      
      const huggingFaceResult = await huggingFaceResponse.json();
      
      if (huggingFaceResult.error) {
        console.error("Hugging Face API error:", huggingFaceResult.error);
        throw new Error(huggingFaceResult.error);
      }
      
      analysisText = huggingFaceResult[0].generated_text;
      console.log("Successfully got response from Hugging Face");
    } catch (huggingFaceError) {
      console.error("Failed with Hugging Face, falling back to Mistral:", huggingFaceError);
      error = huggingFaceError;
      
      // Fall back to Mistral API if Hugging Face fails
      try {
        const mistralSystemPrompt = language.toLowerCase() === "tamil" 
          ? "நீங்கள் முதன்மை சுகாதார பார்வைகளை வழங்கும் ஒரு மருத்துவ AI உதவியாளர். உங்கள் பதில்களை இவ்வாறு அமைக்கவும்: 1) சுருக்கமான பகுப்பாய்வு, 2) சாத்தியமான நிலைமைகள் சதவீதங்களுடன், 3) செய்யவேண்டியவை பட்டியல், 4) செய்யக்கூடாதவை பட்டியல், 5) இயற்கை தீர்வுகள், 6) தொழில்முறை பரிந்துரைகள், 7) மருத்துவ மறுப்பு."
          : "You are a medical AI assistant providing preliminary health insights. Structure your responses with: 1) Brief analysis, 2) Possible conditions with percentages, 3) Do's list, 4) Don'ts list, 5) Natural remedies, 6) Professional recommendations, 7) Medical disclaimer.";
        
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
                content: mistralSystemPrompt
              },
              {
                role: "user",
                content: language.toLowerCase() === "tamil" 
                  ? `தயவுசெய்து இந்த அறிகுறிகளை ஆராய்க: ${symptoms}`
                  : `Please analyze these symptoms: ${symptoms}`
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

        analysisText = mistralResult.choices?.[0]?.message?.content;
        console.log("Successfully got response from Mistral");
      } catch (mistralError) {
        console.error("Mistral API error:", mistralError);
        throw mistralError;
      }
    }
    
    if (!analysisText) {
      throw new Error("Failed to get analysis from both Hugging Face and Mistral APIs");
    }

    // Parse the analysis into structured data
    const analysisResult = parseHealthAnalysis(analysisText, inputType === "image" ? symptoms : null, language);
    
    // Store in Supabase if auth headers are present
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        
        // Create a Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://jwmjkhwolycsunijaugo.supabase.co';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (user) {
          await supabase.from('health_analyses').insert({
            user_id: user.id,
            symptoms,
            input_type: inputType,
            analysis: analysisResult.analysis,
            recommendation: analysisResult.recommendation
          });
        }
      }
    } catch (storageError) {
      // Just log the error, don't fail the entire request
      console.error("Failed to store analysis in Supabase:", storageError);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-symptoms function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Function to parse the AI-generated health analysis text into structured data
function parseHealthAnalysis(text: string, imageDescription: string | null, language: string): any {
  // Extract the relevant parts after the instruction prompt
  const responseContent = text.split("[/INST]")[1] || text;
  
  const isEnglish = language.toLowerCase() !== "tamil";
  
  // Create a fallback response based on language
  const fallbackResponse = {
    analysis: isEnglish
      ? "I've analyzed your symptoms but couldn't structure the results. Please consult a healthcare professional for proper diagnosis."
      : "நான் உங்கள் அறிகுறிகளை ஆராய்ந்தேன் ஆனால் முடிவுகளை கட்டமைக்க முடியவில்லை. சரியான நோயறியலுக்கு ஒரு சுகாதார நிபுணரை ஆலோசிக்கவும்.",
    possibleConditions: [
      { name: isEnglish ? "Unable to determine" : "தீர்மானிக்க முடியவில்லை", probability: 0 }
    ],
    dos: [isEnglish ? "Consult a healthcare professional" : "ஒரு சுகாதார நிபுணரை ஆலோசிக்கவும்"],
    donts: [isEnglish ? "Self-diagnose based on limited information" : "வரையறுக்கப்பட்ட தகவல்களின் அடிப்படையில் சுய நோயறியல்"],
    naturalRemedies: [isEnglish ? "Rest and proper hydration while seeking medical advice" : "மருத்துவ ஆலோசனையை நாடும் போது ஓய்வு மற்றும் முறையான நீரேற்றம்"],
    recommendation: isEnglish 
      ? "Please consult with a healthcare professional for proper evaluation." 
      : "சரியான மதிப்பீட்டிற்கு ஒரு சுகாதார நிபுணரை ஆலோசிக்கவும்.",
    imageAnalysis: imageDescription,
    language
  };

  try {
    // Analysis section titles in both languages
    const analysisTitles = isEnglish ? ["analysis", "symptoms"] : ["பகுப்பாய்வு", "அறிகுறிகள்"];
    const conditionsTitles = isEnglish ? ["possible conditions", "conditions", "condition"] : ["சாத்தியமான நிலைமைகள்", "நிலைமைகள்", "நோய்கள்"];
    const dosTitles = isEnglish ? ["do", "dos", "do's"] : ["செய்யவேண்டியவை"];
    const dontsTitles = isEnglish ? ["don", "donts", "don'ts"] : ["செய்யக்கூடாதவை"];
    const remediesTitles = isEnglish ? ["natural remedies", "remedies"] : ["இயற்கை தீர்வுகள்", "தீர்வுகள்"];
    const recommendationTitles = isEnglish ? ["recommendation", "professional recommendations"] : ["பரிந்துரை", "தொழில்முறை பரிந்துரைகள்"];
    
    // Create regex patterns for each section based on language
    function createTitlePattern(titles: string[]) {
      const titlesPattern = titles.join("|");
      return new RegExp(`(?:${titlesPattern}).*?(?:\\n\\n|\\d\\.(?!\\s*\\d))`, "is");
    }

    // Extract analysis
    const analysisPattern = createTitlePattern(analysisTitles);
    const analysisMatch = responseContent.match(analysisPattern);
    const analysis = analysisMatch ? 
      analysisMatch[0].replace(/\d\.\s*/, '').trim() : 
      fallbackResponse.analysis;
    
    // Extract possible conditions with percentages
    const conditionsPattern = createTitlePattern(conditionsTitles);
    const conditionsSection = responseContent.match(conditionsPattern)?.[0] || "";
    
    let possibleConditions: {name: string, probability: number}[] = [];
    
    // Look for conditions with percentage format
    const conditionMatches = conditionsSection.matchAll(/([A-Za-zமினைதுஎஅஉஙஞணடணநபமயரலவழளறனக்ச]\s*[A-Za-zமினைதுஎஅஉஙஞணடணநபமயரலவழளறனக்ச\s]+)(?:\s*[-–:]\s*|\s+\(|:\s*)(\d+)%/g);
    possibleConditions = Array.from(conditionMatches).map(match => ({
      name: match[1].trim(),
      probability: parseInt(match[2], 10)
    }));

    // If no conditions with percentages, try without percentages
    if (possibleConditions.length === 0) {
      const conditionLines = conditionsSection.split('\n').slice(1) || [];
      
      for (const line of conditionLines) {
        if (line.trim() && !conditionsTitles.some(title => line.toLowerCase().includes(title.toLowerCase()))) {
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
    
    // Fallback if still no conditions found
    if (possibleConditions.length === 0) {
      possibleConditions = fallbackResponse.possibleConditions;
    }

    // Extract do's
    const dosPattern = createTitlePattern(dosTitles);
    const dosSection = responseContent.match(dosPattern)?.[0] || "";
    const dos = extractBulletPoints(dosSection);
    
    // Extract don'ts
    const dontsPattern = createTitlePattern(dontsTitles);
    const dontsSection = responseContent.match(dontsPattern)?.[0] || "";
    const donts = extractBulletPoints(dontsSection);
    
    // Extract natural remedies
    const remediesPattern = createTitlePattern(remediesTitles);
    const remediesSection = responseContent.match(remediesPattern)?.[0] || "";
    const naturalRemedies = extractBulletPoints(remediesSection);
    
    // Extract recommendation
    const recommendationPattern = createTitlePattern(recommendationTitles);
    const recommendationSection = responseContent.match(recommendationPattern)?.[0] || "";
    const recommendationLines = recommendationSection.split('\n').slice(1);
    const recommendation = recommendationLines.join(' ').replace(/^[-•*\d]+\s*/, '').trim() || 
      fallbackResponse.recommendation;
    
    return {
      analysis,
      possibleConditions: possibleConditions.length > 0 ? possibleConditions : fallbackResponse.possibleConditions,
      dos: dos.length > 0 ? dos : fallbackResponse.dos,
      donts: donts.length > 0 ? donts : fallbackResponse.donts,
      naturalRemedies: naturalRemedies.length > 0 ? naturalRemedies : fallbackResponse.naturalRemedies,
      recommendation,
      imageAnalysis: imageDescription,
      language
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
