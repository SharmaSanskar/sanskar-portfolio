import { HeroSection } from '@/app/components/HeroSection';
import { WorkSection } from '@/app/components/WorkSection';
import { ProjectSection } from '@/app/components/ProjectSection';
import AboutContactSection from '@/app/components/AboutContactSection';
import { StickyNav } from '@/app/components/StickyNav';
import { Backdrop } from '@/app/components/Backdrop';

export default function Home() {
  return (
    <>
      <Backdrop />
      <StickyNav />
      <main className="relative z-10">
        <HeroSection />
        {/* Work starts rising while the hero is still settling into the canvas,
            so there is no empty dark screen between the two. */}
        <div className="relative -mt-[40vh]">
          {/* Anchor + scroll-spy target starts where the content does. */}
          <div id="work" aria-hidden="true" className="absolute top-[40vh] bottom-0 left-0 w-px pointer-events-none" />
          <WorkSection />
        </div>
        <div id="projects"><ProjectSection /></div>
        <div id="contact"><AboutContactSection /></div>
      </main>
    </>
  );
}
