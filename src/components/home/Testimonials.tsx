
const testimonials = [
  {
    id: "mj",
    name: "Michael Johnson",
    role: "Patient",
    quote:
      "AGLE CARE helped me understand my symptoms when I couldn't get to a doctor right away. The recommendations were spot on.",
  },
  {
    id: "ew",
    name: "Emily Wilson",
    role: "Healthcare Provider",
    quote:
      "As a nurse practitioner, I recommend AGLE CARE to my patients for initial symptom assessment. It's remarkably accurate.",
  },
  {
    id: "dp",
    name: "David Parker",
    role: "Regular User",
    quote:
      "The natural remedies suggested by AGLE CARE have been incredibly helpful for managing my chronic condition between doctor visits.",
  },
];

const Testimonials = () => {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-gray-600">
          Thousands of people are using AGLE CARE to get quick, reliable health insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-agleblue font-semibold">
                {testimonial.id.toUpperCase()}
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"{testimonial.quote}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
