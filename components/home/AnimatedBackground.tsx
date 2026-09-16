'use client';

export default function AnimatedBackground() {
  // ============================================
  // Twinkling Stars - Static positions
  // শুধু সাদা তারা, সোনালী নেই
  // ============================================
  const stars = [
    { left: '8%', top: '15%', delay: '0s', size: 1.5 },
    { left: '22%', top: '45%', delay: '1.2s', size: 1 },
    { left: '35%', top: '20%', delay: '2.4s', size: 2 },
    { left: '48%', top: '70%', delay: '0.8s', size: 1 },
    { left: '62%', top: '30%', delay: '1.8s', size: 1.5 },
    { left: '75%', top: '60%', delay: '3s', size: 1 },
    { left: '88%', top: '25%', delay: '0.5s', size: 1.5 },
    { left: '15%', top: '80%', delay: '2s', size: 1 },
    { left: '55%', top: '10%', delay: '1.5s', size: 1 },
    { left: '92%', top: '75%', delay: '2.8s', size: 1.2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
      {/* ============================================
          LAYER 1: Animated Gradient Background
          (শুধু নেভি টোন, সোনালী/কমলা নেই)
          ============================================ */}
      <div className="absolute inset-0 animated-bg-gradient" />

      {/* ============================================
          LAYER 2: Grid Pattern (Static)
          ============================================ */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* ============================================
          LAYER 3: Subtle Blue Glow (Top Right)
          (সোনালী এর বদলে নীল)
          ============================================ */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] 
                   bg-blue-500 rounded-full blur-[160px] 
                   animated-pulse-glow"
        style={{ 
          willChange: 'opacity, transform',
          opacity: 0.08,
        }}
      />

      {/* ============================================
          LAYER 4: Subtle Indigo Glow (Bottom Left)
          (কমলা এর বদলে ইন্ডিগো)
          ============================================ */}
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] 
                   bg-indigo-500 rounded-full blur-[160px] 
                   animated-pulse-glow"
        style={{
          willChange: 'opacity, transform',
          animationDelay: '2.5s',
          opacity: 0.08,
        }}
      />

      {/* ============================================
          LAYER 5: Twinkling Stars
          (সাদা তারা, সোনালী নয়)
          ============================================ */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white animated-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            animationDelay: star.delay,
            willChange: 'opacity, transform',
          }}
        />
      ))}

      {/* ============================================
          LAYER 6: Top Gradient Fade
          ============================================ */}
      <div className="absolute top-0 left-0 right-0 h-40 
                      bg-gradient-to-b from-navy via-navy/50 to-transparent" />

      {/* ============================================
          LAYER 7: Bottom Gradient Fade
          ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 h-40 
                      bg-gradient-to-t from-navy via-navy/50 to-transparent" />
    </div>
  );
}