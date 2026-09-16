import { useTranslations } from 'next-intl';
import { ArrowRight, Phone, MapPin, Mail } from 'lucide-react';

// ============================================
// HOME PAGE
// ============================================
export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-gradient-navy">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="section-padding container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left - Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Badge - বাংলা টেক্সট ফিট করার জন্য */}
            <div className="inline-block mb-6">
              <span className="badge-gold text-bangla-safe">
                {t('hero.badge')}
              </span>
            </div>

            {/* Heading - বেশি line-height */}
            <h1 className="heading-1 mb-6 text-bangla-safe">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-muted text-lg mb-8 leading-[1.85] max-w-2xl mx-auto lg:mx-0 text-bangla-safe">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/contact" className="btn-primary">
                <Phone size={18} />
                <span className="text-bangla-safe">{t('hero.cta1')}</span>
              </a>
              <a href="/services" className="btn-secondary">
                <span className="text-bangla-safe">{t('hero.cta2')}</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Right - Placeholder */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow-gold">
              <div className="text-navy text-center p-8">
                <h2 className="text-3xl font-bold mb-2">ZARIF</h2>
                <p className="text-navy/80 font-semibold">LANDCARE CENTER</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TRUST SECTION
          ============================================ */}
      <section className="section-padding container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4 text-bangla-safe">
            {t('hero.trust')}
          </h2>
          <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full" />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-orange flex items-center justify-center">
              <Phone className="text-white" size={24} />
            </div>
            <h3 className="heading-3 mb-2 text-bangla-safe">যোগাযোগ</h3>
            <p className="text-muted text-sm text-bangla-safe">
              +880 1788-766735
            </p>
          </div>

          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-orange flex items-center justify-center">
              <MapPin className="text-white" size={24} />
            </div>
            <h3 className="heading-3 mb-2 text-bangla-safe">ঠিকানা</h3>
            <p className="text-muted text-sm text-bangla-safe leading-relaxed">
              হাসাইল বাজার, টংগীবাড়ী, মুন্সিগঞ্জ
            </p>
          </div>

          <div className="card text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-orange flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
            <h3 className="heading-3 mb-2 text-bangla-safe">ইমেইল</h3>
            <p className="text-muted text-sm text-bangla-safe break-all">
              zariflandcare@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SYSTEM STATUS
          ============================================ */}
      <section className="section-padding container-custom">
        <div className="card-glass text-center max-w-3xl mx-auto">
          <h2 className="heading-3 mb-4 text-gradient-gold text-bangla-safe">
            ✅ সিস্টেম সফলভাবে সেটআপ হয়েছে
          </h2>
          <p className="text-muted mb-6 text-bangla-safe leading-relaxed">
            Next.js + Supabase + Vercel + বাংলা/ইংরেজি ভাষা সিস্টেম কাজ করছে।
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="status-approved">Next.js 14</span>
            <span className="status-approved">Supabase</span>
            <span className="status-approved">i18n</span>
            <span className="status-approved">Tailwind</span>
            <span className="status-approved">Framer Motion</span>
          </div>
        </div>
      </section>
    </main>
  );
}