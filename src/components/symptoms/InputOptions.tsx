import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Mic, Image, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/context/HealthContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthAnalysisLanguage } from "@/types/health";

const InputOptions = () => {
  const navigate = useNavigate();
  const { analyzing, analyzeSymptomsText, analyzeSymptomsVoice, analyzeSymptomsImage, language, setLanguage } = useHealth();
  const [selectedOption, setSelectedOption] = useState<"text" | "voice" | "image" | null>(null);
  const [symptomText, setSymptomText] = useState("");
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleOptionSelect = (option: "text" | "voice" | "image") => {
    setSelectedOption(option);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as HealthAnalysisLanguage);
  };

  const handleTextSubmit = async () => {
    if (!symptomText.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    await analyzeSymptomsText(symptomText);
    navigate("/results");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success("Recording completed");
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleVoiceSubmit = async () => {
    if (!audioBlob) {
      toast.error("Please record your voice first");
      return;
    }

    await analyzeSymptomsVoice(audioBlob);
    navigate("/results");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match('image/jpeg|image/png|image/jpg')) {
        toast.error('Please upload a JPEG or PNG image');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">How would you like to describe your symptoms?</h2>
        
        <div className="flex items-center">
          <Globe size={20} className="mr-2 text-gray-500" />
          <Select defaultValue={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="tamil">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
            disabled={analyzing || !symptomText.trim()}
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : "Continue"}
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
                  <p className="mt-2 font-medium">Recording... {formatTime(recordingTime)}</p>
                </div>
              ) : audioBlob ? (
                <div>
                  <div className="bg-green-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-2">
                    <Mic size={32} className="text-green-600" />
                  </div>
                  <p className="font-medium">Recording completed</p>
                  <audio className="mt-3 mx-auto" controls src={URL.createObjectURL(audioBlob)}></audio>
                </div>
              ) : (
                <>
                  <Mic size={48} className="mx-auto text-gray-400" />
                  <p className="mt-2">Click the button below to start recording</p>
                </>
              )}
            </div>
            
            {!audioBlob ? (
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 ${isRecording ? "bg-red-500 hover:bg-red-600" : "agle-button"}`}
                disabled={analyzing}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            ) : (
              <div className="flex space-x-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAudioBlob(null);
                    audioChunksRef.current = [];
                  }}
                >
                  Record Again
                </Button>
                <Button
                  onClick={handleVoiceSubmit}
                  className="agle-button"
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Continue"}
                </Button>
              </div>
            )}
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
                <div className="mt-4 flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove image
                  </Button>
                  <Button
                    onClick={handleImageSubmit}
                    className="agle-button"
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : "Continue with this image"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center mb-4">
                <Image size={48} className="mx-auto text-gray-400" />
                <p className="mt-2">Upload an image of your visible symptoms</p>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG</p>
                
                <div className="mt-4">
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
            )}
          </div>
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
