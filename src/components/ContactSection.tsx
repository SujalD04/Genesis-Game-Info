import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'react-feather';
import emailjs from "@emailjs/browser";


const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState({
    message: "",
    type: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submissionDate = new Date().toLocaleString(); // Auto-generate submission date
    setIsLoading(true); // Show loading state

    const emailData = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      submission_date: submissionDate, // Auto-submitted field
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!

      )
      .then(
        (result) => {
          console.log("Email sent!", result.text);
          setStatusMessage({ message: "Message sent successfully!", type: "success" });
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.error("Failed to send email:", error.text);
          setStatusMessage({ message: "Error sending message. Please try again.", type: "error" });
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 font-roboto">
            <div
              className="absolute inset-0 z-[0] h-full"
              style={{
                backgroundImage: 'url(/bg5.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                width: '100%',
              }}
            >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12 z-10 relative"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
            Contact{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll
            respond as soon as possible.
          </p>
        </motion.div>

        <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-lg z-10 relative"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800/70 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-800/70 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Phone (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800/70 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Your phone number"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800/70 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Subject of your message"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 bg-gray-800/70 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Your message"
        />
      </div>

      {statusMessage.message && (
        <div
          className={`p-4 rounded-lg text-center font-semibold mt-4 ${
            statusMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        disabled={isLoading}
      >
        {isLoading ? <span>Sending...</span> : <span>Send Message</span>}
        <Send className="h-5 w-5" />
      </motion.button>
    </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
