
import { MessageSquare, Activity, FileText } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How AGLE CARE Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our AI-powered platform analyzes your symptoms and provides personalized health insights in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-agleblue" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Describe Your Symptoms</h3>
          <p className="text-gray-600">
            Share your health concerns via text, voice recording, or images and let our AI analyze.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="text-agleblue" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Receive AI Analysis</h3>
          <p className="text-gray-600">
            Our advanced AI analyzes your input and provides possible conditions and insights.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-agleblue" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
          <p className="text-gray-600">
            Learn about possible conditions, recommended specialists, and helpful health tips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
