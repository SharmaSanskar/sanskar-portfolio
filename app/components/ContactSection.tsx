'use client';

import React, { useRef, useState } from 'react';
import { Mail, Github, BookOpen, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { RollText } from './RollText';
import { CONTACT_EMAIL } from '@/app/constants/site';
import { motion } from 'motion/react';
import { ChapterLabel } from './ChapterLabel';

interface ContactSectionProps {
  isRevealed?: boolean;
}

export function ContactSection({ isRevealed = true }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // EmailJS credentials come from .env.local (see README / .env.example).
  // Referenced statically so Next inlines them at build time.
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_ID ?? '';
  const configured = Boolean(serviceId && templateId && publicKey);

  // The SDK is loaded on submit rather than statically — ContactSection renders
  // on first paint, so a static import put the whole SDK in the initial bundle.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    if (!configured) {
      console.error(
        '[contact] EmailJS is not configured: set NEXT_PUBLIC_EMAILJS_SERVICE_ID, ' +
          'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.local'
      );
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          message: formData.message,
        },
        { publicKey }
      );
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('[contact] EmailJS send failed', err);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    {
      text: 'Email me',
      icon: Mail,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      text: 'Code on GitHub',
      icon: Github,
      href: 'https://github.com/SharmaSanskar',
    },
    {
      text: 'Writing on Medium',
      icon: BookOpen,
      href: 'https://sharmasanskar.medium.com/',
    },
    {
      text: 'Follow on Twitter',
      icon: Twitter,
      href: 'https://twitter.com/sharma__sanskar',
    },
    {
      text: 'Connect on LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/sharma-sanskar/',
    },
  ];

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Label sits in the flow above the grid, so it can never overlap it. */}
      <div className="flex-1 flex flex-col justify-center px-gutter pt-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 md:mb-14"
        >
          <ChapterLabel index={4}>Contact</ChapterLabel>
        </motion.div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24">
          {/* Left Column - Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-row flex-wrap gap-3 md:flex-col"
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
                whileHover={{ x: 6 }}
                aria-label={link.text}
                className="flex items-center gap-4 group w-fit"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center border border-edge bg-input-bg group-hover:border-accent group-hover:bg-accent-soft transition-colors duration-300"
                >
                  <link.icon size={20} className="wiggle-on-hover text-heading transition-colors duration-300 group-hover:text-accent" />
                </div>
                <span
                  className="hidden md:inline text-xl text-heading transition-colors duration-300 group-hover:text-accent"
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3.5 md:p-4 rounded-none border border-edge bg-input-bg text-heading placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-[border-color,box-shadow] duration-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3.5 md:p-4 rounded-none border border-edge bg-input-bg text-heading placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-[border-color,box-shadow] duration-300"
                  required
                />
              </div>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 rounded-none border border-edge bg-input-bg text-heading placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] transition-[border-color,box-shadow] duration-300 resize-none h-28 md:h-40"
                required
              />
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                aria-busy={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full p-4 type-label bg-accent text-on-accent flex items-center justify-center disabled:opacity-70 disabled:cursor-wait transition-[background-color,box-shadow,opacity] duration-300 hover:bg-accent-hover hover:shadow-[0_10px_36px_var(--color-accent-glow)]"
              >
                {/* The arrow grows in from nothing, pushing the label over. */}
                <span className="inline-flex w-0 opacity-0 -translate-x-2 group-hover:w-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out overflow-hidden" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
                <RollText>{status === 'sending' ? 'SENDING…' : 'SEND MESSAGE'}</RollText>
              </motion.button>
              <div aria-live="polite" className="min-h-[1.25rem]">
                {status === 'sent' && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-center text-accent">
                    Thanks — your message is on its way. I&apos;ll reply soon.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-center text-secondary">
                    That didn&apos;t send. Email me directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent link-underline">{CONTACT_EMAIL}</a>.
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom — split signature, mirroring the hero name, hugging the bottom edge */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        className="px-gutter pb-5 md:pb-7 flex flex-wrap items-baseline justify-center gap-x-6 md:gap-x-10 gap-y-1"
      >
        <h2
          className="font-medium text-heading tracking-tight leading-[0.92]"
          style={{ fontSize: 'clamp(3rem, min(11vw, 19vh), 12rem)' }}
        >
          Let&apos;s
        </h2>
        <span
          className="font-serif italic tracking-tight leading-[0.92] bg-gradient-to-br from-heading to-accent bg-clip-text text-transparent"
          style={{ fontSize: 'clamp(3rem, min(11vw, 19vh), 12rem)' }}
        >
          Connect.
        </span>
      </motion.div>
    </div>
  );
}