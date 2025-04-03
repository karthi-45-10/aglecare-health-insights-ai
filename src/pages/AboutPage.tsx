
import Layout from "@/components/layout/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About AGLECARE</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            AGLECARE is an AI-powered healthcare assistant designed to provide personalized medical insights and guidance. Our platform uses advanced artificial intelligence to analyze symptoms and offer health recommendations.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            We aim to make preliminary healthcare information accessible to everyone, empowering users to make better decisions about their health. AGLECARE bridges the gap between self-diagnosis and professional medical care by providing reliable insights based on cutting-edge AI technology.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Help</h2>
          <p>
            AGLECARE assists users by:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Analyzing symptoms through text, voice, or image descriptions</li>
            <li>Providing information on possible conditions</li>
            <li>Offering practical do's and don'ts for symptom management</li>
            <li>Suggesting natural remedies when appropriate</li>
            <li>Recommending when professional medical care should be sought</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Important Disclaimer</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p>
              AGLECARE is designed to provide information and insights, but it is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding a medical condition.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Technology</h2>
          <p>
            AGLECARE utilizes advanced AI models from Hugging Face and language processing capabilities to analyze user-provided symptoms and generate helpful health insights. Our system continually learns and improves its recommendations based on medical knowledge and user feedback.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
