'use client';

import React, { useRef, useState } from 'react';
import { Mail, Github, BookOpen, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import emailjs from '@emailjs/browser';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_ID || '';

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch(() => setStatus('Failed to send message. Try again later.'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    {
      text: 'Send me a mail',
      icon: Mail,
      href: 'mailto:sharmasanskar004@gmail.com',
    },
    {
      text: 'View my work on Github',
      icon: Github,
      href: 'https://github.com/SharmaSanskar',
    },
    {
      text: 'Read my blogs on Medium',
      icon: BookOpen,
      href: 'https://sharmasanskar.medium.com/',
    },
    {
      text: 'Follow me on Twitter',
      icon: Twitter,
      href: 'https://twitter.com/sharma__sanskar',
    },
    {
      text: 'Connect with me on Linkedin',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/sharma-sanskar/',
    },
  ];

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Two Column Layout - Takes most of the space */}
      <div className="flex-1 flex items-center justify-center px-12 md:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column - Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="space-y-6"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 0.4 + index * 0.1,
                }}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderColor: 'rgba(168, 162, 158, 0.3)',
                    background: 'rgba(168, 162, 158, 0.05)',
                  }}
                >
                  <link.icon size={20} style={{ color: 'var(--color-stone-200)' }} />
                </div>
                <span
                  className="text-lg md:text-xl transition-colors duration-300 group-hover:opacity-70"
                  style={{ color: 'var(--color-stone-200)' }}
                >
                  {link.text}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-4 rounded-none border bg-transparent focus:outline-none focus:border-stone-400 transition-colors duration-300"
                  style={{
                    borderColor: 'rgba(168, 162, 158, 0.3)',
                    color: 'var(--color-stone-200)',
                  }}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-4 rounded-none border bg-transparent focus:outline-none focus:border-stone-400 transition-colors duration-300"
                  style={{
                    borderColor: 'rgba(168, 162, 158, 0.3)',
                    color: 'var(--color-stone-200)',
                  }}
                  required
                />
              </div>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 rounded-none border bg-transparent focus:outline-none focus:border-stone-400 transition-colors duration-300 resize-none h-48"
                style={{
                  borderColor: 'rgba(168, 162, 158, 0.3)',
                  color: 'var(--color-stone-200)',
                }}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 border transition-all duration-300 hover:bg-stone-200 hover:text-black"
                style={{
                  borderColor: 'rgba(168, 162, 158, 0.3)',
                  color: 'var(--color-stone-200)',
                }}
              >
                Send Message
              </motion.button>
              {status && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center"
                  style={{ color: 'var(--color-stone-400)' }}
                >
                  {status}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom - Big Text */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        className="pb-12 md:pb-16 text-center"
      >
        <h2
          className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
          style={{ color: 'var(--color-stone-200)' }}
        >
          LET'S CONNECT
        </h2>
      </motion.div>
    </div>
  );
}