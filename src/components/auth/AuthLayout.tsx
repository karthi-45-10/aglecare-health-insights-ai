
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  testimonial?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, testimonial = true }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="bg-agleblue text-white p-8 md:p-12 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Welcome to AGLECARE</h2>
          <p className="mt-2">
            Your AI-powered healthcare assistant for personalized medical insights and guidance.
          </p>
        </div>

        {testimonial && (
          <div className="mt-auto">
            <div className="bg-blue-600/30 backdrop-blur-sm p-6 rounded-lg">
              <p className="italic mb-4">
                "AGLECARE has transformed how I approach my health concerns. The AI assistant accurately identified my symptoms and connected me with the right specialist."
              </p>
              <p className="text-right">— Sarah Johnson</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center p-8 md:p-12">
        <div className="w-full">
          <div className="mb-8">
            <div className="agle-logo text-center md:text-left">
              <span className="blue">AGLE</span>
              <span className="black">CARE</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
