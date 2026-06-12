import { HeroSection } from '@/app/components/HeroSection';
import { WorkSection } from '@/app/components/WorkSection';
import { ProjectSection } from '@/app/components/ProjectSection';
import AboutContactSection from '@/app/components/AboutContactSection';
import { StickyNav } from '@/app/components/StickyNav';

export default function Home() {
  return (
    <main>
      <StickyNav />
      <HeroSection />
      <div id="work"><WorkSection /></div>
      <div id="projects"><ProjectSection /></div>
      <div id="contact"><AboutContactSection /></div>
    </main>
  );
}
