import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      feedback: 'Amazing platform! It helped me track my stats easily.',
    },
    {
      name: 'Jane Smith',
      feedback: 'A must-have tool for every gamer. Highly recommended!',
    },
    {
      name: 'Alex Johnson',
      feedback: 'The best analytics website out there. Very user-friendly!',
    },
  ];

  return (
    <section className="py-16 bg-black/95 backdrop-blur-md">
      <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 mb-12">
        What Our Users Say
      </h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-black/80 backdrop-blur-lg border border-gray-800 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-center mb-4">
              <Quote className="h-10 w-10 text-blue-500" />
            </div>
            <p className="text-gray-300 text-lg italic">"{testimonial.feedback}"</p>
            <h4 className="mt-4 text-xl font-bold text-blue-400">
              - {testimonial.name}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
