import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Philosophy from './components/Philosophy';
import Program from './components/Program';
import Gallery from './components/Gallery';
import Converter from './components/Converter';
import Footer from './components/Footer';
import SectionDivider from './components/Shared/SectionDivider';

export default function App() {
  return (
    <main className="bg-riksa-cream min-h-screen">
      <Navbar />
      <Hero />
      <SectionDivider color="text-riksa-brown-dark" />
      <About />
      <SectionDivider color="text-riksa-orange" />
      <Philosophy />
      <SectionDivider color="text-riksa-brown-dark" />
      <Program />
      <SectionDivider color="text-riksa-orange" />
      <Gallery />
      <SectionDivider color="text-riksa-brown-dark" />
      <Converter />
      <Footer />
    </main>
  );
}
