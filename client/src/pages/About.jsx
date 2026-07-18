export default function About() {
  return (
    <div className="pt-20 page-enter">
      {/* Hero */}
      <div className="relative py-28 px-6 bg-[#002902] border-b border-[#005b04] text-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)` }} />
        <div className="relative z-10">
          <p className="section-label">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
            Park Ave Jewelers
          </h1>
          <div className="divider-gold" />
          <p className="text-[#888] text-base max-w-lg mx-auto">
            Independent fine jewellery and timepieces from the heart of NYC's historic Diamond District.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label">Since 2023</p>
            <h2 className="font-display text-4xl font-bold text-white mb-5 leading-tight">
              Rooted in the Diamond District
            </h2>
            <div className="space-y-4 text-[#888] text-sm leading-relaxed">
              <p>
                Park Ave Jewelers is an independent jeweller based in Manhattan's historic Diamond District —
                the same few blocks of 47th Street that have set the standard for fine jewellery and watches
                in New York for generations. We hand-select every stone and personally oversee every setting.
              </p>
              <p>
                Our approach is simple: exceptional pieces, fair prices, and the kind of personal attention
                that's earned us a 5.0 rating across dozens of Google reviews from clients who've become friends.
              </p>
              <p>
                Every piece in our collection is GIA certified, ethically sourced, and comes with
                our lifetime craftsmanship guarantee.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-[#003e02] border border-[#005b04] flex items-center justify-center">
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
      <section className="py-16 px-6 bg-[#002902] border-y border-[#005b04]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '2023', label: 'Founded' },
            { num: '5.0★', label: 'Google Rating' },
            { num: '93+', label: 'Five-Star Reviews' },
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#005b04]">
            {[
              {
                icon: '💎',
                title: 'Exceptional Quality',
                desc: 'Every diamond is hand-selected and GIA certified. We accept nothing less than the finest stones in the world.'
              },
              {
                icon: '🤝',
                title: 'Personal Service',
                desc: 'We build real relationships with every client — it\'s why we\'ve earned a 5.0 rating across dozens of reviews.'
              },
              {
                icon: '⚒️',
                title: 'Master Craftsmanship',
                desc: 'Each piece is crafted by experienced jewellers, ensuring perfection in every detail.'
              },
            ].map(v => (
              <div key={v.title} className="bg-[#003102] p-8 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies */}
      <section id="policies" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label">Good to Know</p>
            <h2 className="section-title">Our Policies</h2>
          </div>
          <div className="space-y-8">
            <div className="border-l-2 border-[#C9A84C]/30 pl-6">
              <h3 className="text-white font-semibold mb-2">Returns &amp; Exchanges</h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Returns are issued as store credit only — we're unable to offer cash or card refunds.
                Please contact us before returning a piece so we can assist with the exchange.
              </p>
            </div>
            <div className="border-l-2 border-[#C9A84C]/30 pl-6">
              <h3 className="text-white font-semibold mb-2">Shipping</h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Complimentary insured shipping on all orders within the continental US. Contact us for
                international or expedited shipping options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="py-16 px-6 bg-[#002902]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">Come See Us</p>
          <h2 className="section-title mb-4">Visit Our Boutique</h2>
          <div className="divider-gold" />
          <p className="text-[#888] text-sm mb-8">25 W 47th St, Booth #8, New York, NY 10036</p>
          <div className="grid grid-cols-3 gap-4 text-sm text-[#666] mb-8">
            <div><p className="text-white font-medium mb-1">Mon – Fri</p><p>10am – 5:30pm</p></div>
            <div><p className="text-white font-medium mb-1">Saturday</p><p>11am – 5pm</p></div>
            <div><p className="text-white font-medium mb-1">Sunday</p><p>Closed</p></div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a href="/contact" className="btn-gold">Book an Appointment</a>
            <a href="/locations" className="btn-outline-gold">All Locations</a>
          </div>
        </div>
      </section>
    </div>
  );
}
