
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Your Personal <span className="text-agleblue">AI Healthcare</span> Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Get instant health insights, symptom analysis, and medical guidance powered by advanced AI technology.
        </p>
        <div>
          <Link to="/symptoms">
            <Button className="agle-button text-base">Get Started</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden">
        <img
          src="/lovable-uploads/3f1e994f-b774-4584-931c-c7adf487da2d.png"
          alt="Doctor with stethoscope analyzing health data"
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default Hero;
