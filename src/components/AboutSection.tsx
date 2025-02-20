import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sujal',
    role: 'Lead Developer',
    image:
      '/dev1.jpeg',
    bio: 'Gaming enthusiast and full-stack developer with a passion for creating immersive digital experiences.',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  },
];

const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen w-full bg-black font-roboto">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-blue-400 mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're a team of passionate gamers and developers dedicated to helping
            you improve your gaming experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              className="group relative perspective"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative bg-blue-800/40 rounded-xl overflow-hidden shadow-lg transform-gpu transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
                {/* Front */}
                <div className="p-6 backface-hidden">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-300 mb-2 text-center">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 mb-4 text-center">{member.role}</p>
                  <div className="flex justify-center space-x-4">
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Github className="h-6 w-6" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 p-6 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl backface-hidden rotate-y-180 flex items-center justify-center">
                  <p className="text-white text-center">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
