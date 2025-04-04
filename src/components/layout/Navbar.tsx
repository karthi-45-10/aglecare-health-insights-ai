
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHealth } from "@/context/HealthContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthAnalysisLanguage } from "@/types/health";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useHealth();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as HealthAnalysisLanguage);
  };

  return (
    <nav className="py-4 px-6 md:px-12 border-b flex justify-between items-center">
      <Link to="/" className="agle-logo">
        <span className="blue">AGLE</span>
        <span className="black">CARE</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Globe size={18} />
          <Select defaultValue={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="tamil">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Link to="/" className="text-sm font-medium hover:underline">
          Home
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-agleblue hover:bg-blue-600" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
