
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container mx-auto px-6 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="agle-logo mb-4 inline-block">
              <span className="blue">AGLE</span>
              <span className="black">CARE</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Your AI-powered healthcare assistant for personalized medical insights and guidance.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-agleblue text-sm">Help Center</Link></li>
              <li><Link to="/disclaimer" className="text-gray-600 hover:text-agleblue text-sm">Medical Disclaimer</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-agleblue text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-agleblue text-sm">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <p className="text-gray-600 text-sm">Email: support@aglecare.com</p>
            <p className="text-gray-600 text-sm">Phone: +1 (800) 123-4567</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} AGLE CARE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
