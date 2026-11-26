import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import KegunaanSection from '@/components/landing/KegunaanSection';
import CaraPakaiSection from '@/components/landing/CaraPakaiSection';
import UkuranSection from '@/components/landing/UkuranSection';
import LokasiSection from '@/components/landing/LokasiSection';
import KeamananSection from '@/components/landing/KeamananSection';
import FaqSection from '@/components/landing/FaqSection';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <KegunaanSection />
      <CaraPakaiSection />
      <UkuranSection />
      <LokasiSection />
      <KeamananSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
