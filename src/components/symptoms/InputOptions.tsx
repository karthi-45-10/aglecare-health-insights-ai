
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/context/HealthContext";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SupportedLanguage } from "@/types/health";

const InputOptions = () => {
  const navigate = useNavigate();
  const { analyzeSymptomsText, analyzeSymptomsVoice, analyzeSymptomsImage, analyzing, language, setLanguage } = useHealth();
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "image">("text");
  const [symptomText, setSymptomText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submit handler for text input
  const handleTextSubmit = async () => {
    if (!symptomText.trim()) return;
    await analyzeSymptomsText(symptomText);
    navigate("/results");
  };

  // Record voice input (simulated)
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        // Simulate having a recording and analyze it
        const blob = new Blob(["dummy audio data"], { type: "audio/wav" });
        analyzeSymptomsVoice(blob);
        navigate("/results");
      }, 3000);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit handler for image input
  const handleImageSubmit = async () => {
    if (!imageFile) return;
    await analyzeSymptomsImage(imageFile);
    navigate("/results");
  };

  // Language change handler
  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "text"
                ? "bg-agleblue text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {language === "english" ? "Text" : "உரை"}
          </Button>
          <Button
            onClick={() => setActiveTab("voice")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "voice"
                ? "bg-agleblue text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {language === "english" ? "Voice" : "குரல்"}
          </Button>
          <Button
            onClick={() => setActiveTab("image")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "image"
                ? "bg-agleblue text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {language === "english" ? "Image" : "படம்"}
          </Button>
        </div>
        
        <div className="w-36">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="tamil">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeTab === "text" && (
        <div className="space-y-4">
          <Textarea
            placeholder={language === "english" 
              ? "Describe your symptoms in detail..." 
              : "உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்..."}
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
            rows={6}
            className="w-full p-4 border rounded-lg"
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!symptomText.trim() || analyzing}
            className="bg-agleblue hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full w-full"
          >
            {analyzing 
              ? (language === "english" ? "Analyzing..." : "ஆராய்கிறது...") 
              : (language === "english" ? "Analyze Symptoms" : "அறிகுறிகளை ஆராய்க")}
          </Button>
        </div>
      )}

      {activeTab === "voice" && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center">
            <Button
              onClick={handleVoiceRecord}
              className={`w-24 h-24 rounded-full ${
                isRecording ? "bg-red-500" : "bg-agleblue"
              } hover:bg-blue-600 text-white flex items-center justify-center`}
            >
              {isRecording ? (
                <span className="animate-ping h-4 w-4 rounded-full bg-white opacity-75"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              )}
            </Button>
          </div>
          <p className="text-center text-gray-600">
            {isRecording 
              ? (language === "english" ? "Recording... Click to stop" : "பதிவு செய்கிறது... நிறுத்த கிளிக் செய்யவும்") 
              : (language === "english" ? "Click to start recording" : "பதிவுசெய்ய கிளிக் செய்யவும்")}
          </p>
        </div>
      )}

      {activeTab === "image" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mb-4 rounded"
              />
            ) : (
              <div className="text-center p-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">
                  {language === "english" 
                    ? "Upload an image of the affected area" 
                    : "பாதிக்கப்பட்ட பகுதியின் படத்தைப் பதிவேற்றவும்"}
                </p>
              </div>
            )}
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              className="mt-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg"
            >
              {language === "english" ? "Choose Image" : "படத்தைத் தேர்வுசெய்க"}
            </label>
          </div>
          <Button
            onClick={handleImageSubmit}
            disabled={!imageFile || analyzing}
            className="bg-agleblue hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full w-full"
          >
            {analyzing 
              ? (language === "english" ? "Analyzing..." : "ஆராய்கிறது...") 
              : (language === "english" ? "Analyze Image" : "படத்தை ஆராய்க")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InputOptions;
