import { HeroSection } from '@/app/components/HeroSection';
import { WorkSection } from '@/app/components/WorkSection';
import { ProjectSection } from '@/app/components/ProjectSection';
import AboutSection from '@/app/components/AboutSection';
import { ContactSection } from '@/app/components/ContactSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WorkSection />
      <ProjectSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}