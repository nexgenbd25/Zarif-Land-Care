import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';

// ============================================
// HOME PAGE
// ============================================
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ============================================
          HERO SECTION
          Headline + 3 CTA + Carousel + Trust + Animated Background
          ============================================ */}
      <HeroSection />

      {/* ============================================
          SERVICES SECTION
          6 Service Cards with Hover Effects
          ============================================ */}
      <ServicesSection />

      {/* ============================================
          পরের সেকশনগুলো এখানে যোগ করা হবে
          ============================================ */}
      {/* <AboutSection /> */}
      {/* <HowItWorksSection /> */}
      {/* <WhyChooseUsSection /> */}
      {/* <TeamSection /> */}
      {/* <TestimonialsSection /> */}
      {/* <BlogPreviewSection /> */}
      {/* <FAQSection /> */}
      {/* <CTABannerSection /> */}
    </main>
  );
}