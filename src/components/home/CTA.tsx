
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <div className="bg-agleblue text-white py-16 px-4 rounded-lg text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
      <p className="mb-8 max-w-xl mx-auto">
        Join thousands of users who trust AGLE CARE for their health insights.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/symptoms">
          <Button className="bg-white text-agleblue hover:bg-gray-100">
            Get Started
          </Button>
        </Link>
        <Link to="/about">
          <Button variant="outline" className="border-white text-white hover:bg-blue-600">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CTA;
