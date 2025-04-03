
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <Layout fullWidth>
      <div className="container mx-auto px-4 md:px-6">
        <Hero />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </div>
    </Layout>
  );
};

export default Index;
