import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      feedback: "Genesis has completely changed the way I stay updated with the games I love. The real-time updates on patch notes and live events keep me ahead of the curve. It's a must-have for any gamer!",
    },
    {
      name: 'Jane Smith',
      feedback: "Before Genesis, I used to jump between websites to get game news and updates. Now, I have everything I need in one place. The real-time news and updates are spot-on, and the design is fantastic!",
    },
    {
      name: 'Alex Johnson',
      feedback: "As a content creator, staying informed about new game releases, updates, and live events is crucial. Genesis provides the best insights, and I can rely on it for accurate and timely information.",
    },
  ];

  return (
    <section className="py-16 bg-black/95 backdrop-blur-md">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 mb-12">
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
