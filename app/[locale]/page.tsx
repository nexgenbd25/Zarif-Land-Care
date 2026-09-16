import HeroSection from '@/components/home/HeroSection';

// ============================================
// HOME PAGE
// ============================================
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ============================================
          HERO SECTION (Headline + CTA + Carousel + Trust)
          ============================================ */}
      <HeroSection />

      {/* ============================================
          পরের সেকশনগুলো এখানে যোগ করা হবে
          ============================================ */}
      {/* <ServicesSection /> */}
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