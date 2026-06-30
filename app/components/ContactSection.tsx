'use client';

import React, { useRef, useState } from 'react';
import { Mail, Github, BookOpen, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import emailjs from '@emailjs/browser';

interface ContactSectionProps {
  isRevealed?: boolean;
}

export function ContactSection({ isRevealed = true }: ContactSectionProps) {
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
      <div className="flex-1 flex items-center justify-center px-6 md:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24">
          {/* Left Column - Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{
                  duration: 0.35,
                  ease: 'easeOut',
                  delay: 0.15 + index * 0.05,
                }}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 group w-fit"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center border border-edge group-hover:border-accent transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'var(--color-input-bg)' }}
                >
                  <link.icon size={20} className="text-heading transition-colors duration-300 group-hover:text-accent" />
                </div>
                <span
                  className="text-lg md:text-xl text-heading transition-colors duration-300 group-hover:text-accent"
                >
                  {link.text}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-4 rounded-none border border-edge bg-input-bg text-heading placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-[border-color,box-shadow] duration-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-4 rounded-none border border-edge bg-input-bg text-heading placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-[border-color,box-shadow] duration-300"
                  required
                />
              </div>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 rounded-none border border-edge bg-input-bg text-heading placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-[border-color,box-shadow] duration-300 resize-none h-48"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 type-label bg-accent text-on-accent transition-[background-color,box-shadow] duration-300 hover:bg-accent-hover hover:shadow-[0_10px_36px_var(--color-accent-glow)]"
              >
                SEND MESSAGE
              </motion.button>
              {status && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {status}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom — split signature, mirroring the hero name, hugging the bottom edge */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        className="px-8 md:px-12 pb-5 md:pb-7 flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-10 gap-y-1"
      >
        <h2
          className="font-medium text-heading tracking-tight leading-[0.92]"
          style={{ fontSize: 'clamp(3rem, 12vw, 13rem)' }}
        >
          Let&apos;s
        </h2>
        <span
          className="font-serif italic tracking-tight leading-[0.92] bg-gradient-to-br from-heading to-accent bg-clip-text text-transparent"
          style={{ fontSize: 'clamp(3rem, 12vw, 13rem)' }}
        >
          Connect.
        </span>
      </motion.div>
    </div>
  );
}