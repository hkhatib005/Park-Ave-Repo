export default function About() {
  return (
    <div className="pt-20 page-enter">
      {/* Hero */}
      <div className="relative py-28 px-6 bg-[#080808] border-b border-[#1e1e1e] text-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)` }} />
        <div className="relative z-10">
          <p className="section-label">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
            Park Ave <span className="text-[#C9A84C]">Jewelry</span>
          </h1>
          <div className="divider-gold" />
          <p className="text-[#888] text-base max-w-lg mx-auto">
            A family legacy of extraordinary craftsmanship on New York's most iconic avenue.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label">Since 1987</p>
            <h2 className="font-display text-4xl font-bold text-white mb-5 leading-tight">
              Three Generations of Excellence
            </h2>
            <div className="space-y-4 text-[#888] text-sm leading-relaxed">
              <p>
                Founded in 1987 by master jeweller George Alkhatib, Park Ave Jewelry began as a small atelier
                on Manhattan's most celebrated boulevard. What started as a passion for exceptional gemstones
                has grown into New York City's most trusted name in fine jewellery and luxury timepieces.
              </p>
              <p>
                Today, the third generation continues that legacy — hand-selecting every stone, personally
                overseeing every setting, and maintaining the uncompromising standards that have earned
                us the trust of New York's most discerning clientele.
              </p>
              <p>
                Every piece in our collection is GIA certified, ethically sourced, and comes with
                our lifetime craftsmanship guarantee.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-[#111] border border-[#1e1e1e] flex items-center justify-center">
              <div className="text-center p-8">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.4" className="mx-auto mb-4">
                  <polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/>
                  <line x1="2" y1="8" x2="22" y2="8"/>
                  <line x1="12" y1="2" x2="12" y2="22"/>
                </svg>
                <p className="font-display text-[#C9A84C] text-xl italic">"Where Luxury Meets Legacy"</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#C9A84C]/20" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[#080808] border-y border-[#1e1e1e]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '1987', label: 'Founded' },
            { num: '35+', label: 'Years Experience' },
            { num: '10,000+', label: 'Clients Served' },
            { num: '100%', label: 'Certified Stones' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-3xl md:text-4xl font-bold text-[#C9A84C] mb-1">{s.num}</p>
              <p className="text-[#555] text-xs tracking-[2px] uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">What Sets Us Apart</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1e1e1e]">
            {[
              {
                icon: '💎',
                title: 'Exceptional Quality',
                desc: 'Every diamond is hand-selected and GIA certified. We accept nothing less than the finest stones in the world.'
              },
              {
                icon: '🤝',
                title: 'Personal Service',
                desc: 'Our family has built relationships with clients across generations. Your satisfaction is our legacy.'
              },
              {
                icon: '⚒️',
                title: 'Master Craftsmanship',
                desc: 'Each piece is crafted by jewellers with decades of experience, ensuring perfection in every detail.'
              },
            ].map(v => (
              <div key={v.title} className="bg-[#0a0a0a] p-8 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="py-16 px-6 bg-[#080808]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">Come See Us</p>
          <h2 className="section-title mb-4">Visit Our Boutique</h2>
          <div className="divider-gold" />
          <p className="text-[#888] text-sm mb-8">520 Park Avenue, New York, NY 10022</p>
          <div className="grid grid-cols-3 gap-4 text-sm text-[#666] mb-8">
            <div><p className="text-white font-medium mb-1">Mon – Fri</p><p>10am – 7pm</p></div>
            <div><p className="text-white font-medium mb-1">Saturday</p><p>10am – 6pm</p></div>
            <div><p className="text-white font-medium mb-1">Sunday</p><p>12pm – 5pm</p></div>
          </div>
          <a href="/contact" className="btn-gold">Book an Appointment</a>
        </div>
      </section>
    </div>
  );
}
