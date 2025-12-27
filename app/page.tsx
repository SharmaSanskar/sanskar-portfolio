import { HeroSection } from '@/app/components/HeroSection';
import { WorkSection } from '@/app/components/WorkSection';
import { ProjectSection } from '@/app/components/ProjectSection';
import AboutContactSection from '@/app/components/AboutContactSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WorkSection />
      <ProjectSection />
      <AboutContactSection />
    </main>
  );
}