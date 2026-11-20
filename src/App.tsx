import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Philosophy from './components/Philosophy';
import Program from './components/Program';
import Gallery from './components/Gallery';
import ProductCatalog from './components/ProductCatalog';
import Converter from './components/Converter';
import Footer from './components/Footer';
import SectionDivider from './components/Shared/SectionDivider';
import VolunteerModal from './components/VolunteerModal';

export default function App() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('tentang');

  // Track scroll position to update active navbar link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'philosophy', 'program', 'gallery', 'products', 'converter'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId === 'about' ? 'tentang' : sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FAF7EE] min-h-screen text-stone-900 selection:bg-riksa-green selection:text-white overflow-x-hidden font-sans">
      {/* Floating Navbar (Appears on Scroll Past Hero) */}
      <Navbar 
        onOpenJoinModal={() => setIsJoinModalOpen(true)} 
        activeSection={activeSection}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
      />

      {/* Hero Section (Pristine 2K Ultra HD on Desktop & Mobile) */}
      <Hero 
        onOpenJoinModal={() => setIsJoinModalOpen(true)} 
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(prev => !prev)}
      />

      {/* Main Content Sections */}
      <main>
        <About />

        <SectionDivider color="text-riksa-green" />

        <Philosophy />

        <SectionDivider color="text-riksa-gold" />

        <Program 
          onOpenJoinModal={() => setIsJoinModalOpen(true)} 
        />

        <SectionDivider color="text-riksa-green" />

        <Gallery />

        <SectionDivider color="text-riksa-gold" />

        <ProductCatalog />

        <SectionDivider color="text-riksa-green" />

        <Converter />
      </main>

      {/* Footer */}
      <Footer />

      {/* Volunteer Registration Modal */}
      <VolunteerModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
      />
    </div>
  );
}
