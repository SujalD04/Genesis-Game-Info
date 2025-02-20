import React from 'react';

const Services = () => {
  const services = [
    {
      title: 'Game Overview & Details',
      description: 'Get comprehensive information about popular games, including gameplay mechanics, storylines, platforms, system requirements, and developer info.',
      image:
        '/service1.webp',
    },
    {
      title: 'Latest Game Updates & News',
      description: 'Stay up-to-date with the latest patches, updates, and announcements from game developers.',
      image:
        '/service2.webp',
    },
    {
      title: 'Real-Time Updates',
      description: 'Get live updates on the latest game announcements, news, and trending topics from the gaming world.',
      image:
        '/service3.webp',
    },
  ];

  return (
    <section className="py-16 bg-black/95 backdrop-blur-md">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 mb-12">
        Our Services
      </h2>

      <div className="max-w-6xl mx-auto grid gap-10 px-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative group bg-black/80 backdrop-blur-lg border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="p-6 absolute bottom-0 left-0 w-full text-white z-10">
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-white">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
