
import Layout from "@/components/layout/Layout";
import InputOptions from "@/components/symptoms/InputOptions";

const SymptomsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">AGLECARE</h1>
        <p className="text-center text-gray-600 mb-10">
          Describe your symptoms through text, voice, or images, and receive AI-powered
          insights and recommendations.
        </p>
        <InputOptions />
      </div>
    </Layout>
  );
};

export default SymptomsPage;
