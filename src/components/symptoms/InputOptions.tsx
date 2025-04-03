
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Mic, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/context/HealthContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const InputOptions = () => {
  const navigate = useNavigate();
  const { analyzing, analyzeSymptomsText, analyzeSymptomsVoice, analyzeSymptomsImage } = useHealth();
  const [selectedOption, setSelectedOption] = useState<"text" | "voice" | "image" | null>(null);
  const [symptomText, setSymptomText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleOptionSelect = (option: "text" | "voice" | "image") => {
    setSelectedOption(option);
  };

  const handleTextSubmit = async () => {
    if (!symptomText.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    await analyzeSymptomsText(symptomText);
    navigate("/results");
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.info("Recording started (simulation)");
    
    // Simulate recording for demo purposes
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    toast.success("Recording completed");
    
    // In a real app, we would have actual audio data
    // For demo purposes, we'll create an empty blob
    const audioBlob = new Blob(["dummy audio data"], { type: "audio/wav" });
    
    await analyzeSymptomsVoice(audioBlob);
    navigate("/results");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async () => {
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    await analyzeSymptomsImage(imageFile);
    navigate("/results");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">How would you like to describe your symptoms?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button
          onClick={() => handleOptionSelect("text")}
          className={`p-6 rounded-lg border flex flex-col items-center justify-center transition-all ${
            selectedOption === "text" ? "border-agleblue bg-blue-50" : "hover:bg-gray-50"
          }`}
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <MessageSquare className="text-agleblue" />
          </div>
          <h3 className="font-medium mb-1">Text Description</h3>
          <p className="text-sm text-gray-500">Type your symptoms</p>
        </button>

        <button
          onClick={() => handleOptionSelect("voice")}
          className={`p-6 rounded-lg border flex flex-col items-center justify-center transition-all ${
            selectedOption === "voice" ? "border-agleblue bg-blue-50" : "hover:bg-gray-50"
          }`}
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Mic className="text-agleblue" />
          </div>
          <h3 className="font-medium mb-1">Voice Recording</h3>
          <p className="text-sm text-gray-500">Describe verbally</p>
        </button>

        <button
          onClick={() => handleOptionSelect("image")}
          className={`p-6 rounded-lg border flex flex-col items-center justify-center transition-all ${
            selectedOption === "image" ? "border-agleblue bg-blue-50" : "hover:bg-gray-50"
          }`}
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Image className="text-agleblue" />
          </div>
          <h3 className="font-medium mb-1">Image Upload</h3>
          <p className="text-sm text-gray-500">Share a photo</p>
        </button>
      </div>

      {selectedOption === "text" && (
        <div className="mb-8">
          <Textarea
            placeholder="Describe your symptoms in detail. For example: I've been experiencing a headache and fever for the past two days..."
            className="h-32 mb-4"
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
          />
          <Button
            onClick={handleTextSubmit}
            className="w-full agle-button"
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Continue"}
          </Button>
        </div>
      )}

      {selectedOption === "voice" && (
        <div className="mb-8 text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
            <div className="mb-4">
              {isRecording ? (
                <div className="animate-pulse">
                  <Mic size={48} className="mx-auto text-red-500" />
                  <p className="mt-2 font-medium">Recording...</p>
                </div>
              ) : (
                <>
                  <Mic size={48} className="mx-auto text-gray-400" />
                  <p className="mt-2">Click the button below to start recording</p>
                </>
              )}
            </div>
            
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 ${isRecording ? "bg-red-500 hover:bg-red-600" : "agle-button"}`}
              disabled={analyzing}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Speak clearly and describe your symptoms in detail
          </p>
        </div>
      )}

      {selectedOption === "image" && (
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
            {imagePreview ? (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Symptom preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Remove image
                </Button>
              </div>
            ) : (
              <div className="text-center mb-4">
                <Image size={48} className="mx-auto text-gray-400" />
                <p className="mt-2">Upload an image of your visible symptoms</p>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
              />
              <label htmlFor="imageUpload">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={analyzing}
                  type="button"
                  onClick={() => document.getElementById("imageUpload")?.click()}
                >
                  Choose Image
                </Button>
              </label>
            </div>
          </div>
          
          {imageFile && (
            <Button
              onClick={handleImageSubmit}
              className="w-full agle-button"
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Continue"}
            </Button>
          )}
        </div>
      )}

      {!selectedOption && (
        <div className="text-center">
          <Button
            disabled
            className="opacity-50 agle-button"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default InputOptions;
