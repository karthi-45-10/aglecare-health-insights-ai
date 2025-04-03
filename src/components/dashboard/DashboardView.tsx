
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clipboard, Clock, User } from "lucide-react";

const DashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get user name from metadata which is where Supabase stores custom user data
  const userName = user?.user_metadata?.name || "User";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-gray-600">
          Access your health insights and start a new analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Clipboard className="text-agleblue" />
            </div>
            <h2 className="text-lg font-medium">Start New Analysis</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Describe your symptoms through text, voice, or image and get AI-powered health insights.
          </p>
          <Button onClick={() => navigate("/symptoms")} className="agle-button">
            Begin Analysis
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Clock className="text-agleblue" />
            </div>
            <h2 className="text-lg font-medium">Recent Analyses</h2>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">No recent analyses found.</p>
            <p className="text-sm text-gray-400 mt-1">Your analyses will appear here.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <User className="text-agleblue" />
          </div>
          <h2 className="text-lg font-medium">Your Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="bg-gray-100 p-2 rounded">{userName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="bg-gray-100 p-2 rounded">{user?.email || "Not specified"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
