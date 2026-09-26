const VALUE_ICONS = {
  quality: <><polygon points="12,3 20,8 20,15 12,21 4,15 4,8"/><path d="M4 8l8 3 8-3M12 11v10" opacity="0.5"/></>,
  service: <><path d="M8.5 12.5 L11 15 L16 9"/><circle cx="12" cy="12" r="9"/></>,
  craft: <><path d="M14 6 L18 10 L8 20 L4 20 L4 16 Z"/><path d="M12 8 L16 12" /></>,
};

export default function About() {
  return (
    <div className="pt-20 page-enter">
      {/* Hero */}
      <div className="relative py-28 px-6 bg-[#F4F7F4] border-b border-[#D8E3DC] text-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(ellipse at center, rgba(15,90,58,0.06) 0%, transparent 70%)` }} />
        <div className="relative z-10">
          <p className="section-label">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#14291F] mb-4">
            Park Ave Jewelers
          </h1>
          <div className="divider-gold" />
          <p className="text-[#53655B] text-base max-w-lg mx-auto">
            Independent fine jewellery and timepieces from the heart of NYC's historic Diamond District.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label">Since 2023</p>
            <h2 className="font-display text-4xl font-bold text-[#14291F] mb-5 leading-tight">
              Rooted in the Diamond District
            </h2>
            <div className="space-y-4 text-[#53655B] text-sm leading-relaxed">
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
                Every diamond in our collection is 100% natural — never lab-grown — GIA certified,
                ethically sourced, and comes with our lifetime craftsmanship guarantee.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-[#EEF3EF] border border-[#D8E3DC] overflow-hidden">
              <img src="/images/editorial/lightning.png" alt="Diamond lightning bolt pendant from Park Ave Jewelers" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#0F5A3A] text-white px-6 py-5 max-w-[220px]">
              <p className="font-display text-xl italic leading-tight">“Where luxury meets legacy.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[#F4F7F4] border-y border-[#D8E3DC]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '2023', label: 'Founded' },
            { num: '5.0★', label: 'Google Rating' },
            { num: '93+', label: 'Five-Star Reviews' },
            { num: '100%', label: 'Natural Diamonds' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-3xl md:text-4xl font-bold text-[#0F5A3A] mb-1">{s.num}</p>
              <p className="text-[#6A7A71] text-xs tracking-[2px] uppercase">{s.label}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8E3DC]">
            {[
              {
                icon: VALUE_ICONS.quality,
                title: 'Exceptional Quality',
                desc: '100% natural diamonds, hand-selected and GIA certified. We accept nothing less than the finest stones in the world.'
              },
              {
                icon: VALUE_ICONS.service,
                title: 'Personal Service',
                desc: 'We build real relationships with every client — it\'s why we\'ve earned a 5.0 rating across dozens of reviews.'
              },
              {
                icon: VALUE_ICONS.craft,
                title: 'Master Craftsmanship',
                desc: 'Each piece is crafted by experienced jewellers, ensuring perfection in every detail.'
              },
            ].map(v => (
              <div key={v.title} className="bg-[#FFFFFF] p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-[#0F5A3A]/25 rounded-full">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F5A3A" strokeWidth="1.3">{v.icon}</svg>
                </div>
                <h3 className="font-display text-xl font-bold text-[#14291F] mb-3">{v.title}</h3>
                <p className="text-[#5E6F66] text-sm leading-relaxed">{v.desc}</p>
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
            <div className="border-l-2 border-[#0F5A3A]/30 pl-6">
              <h3 className="text-[#14291F] font-semibold mb-2">Returns &amp; Exchanges</h3>
              <p className="text-[#53655B] text-sm leading-relaxed">
                Returns are issued as store credit only — we're unable to offer cash or card refunds.
                Please contact us before returning a piece so we can assist with the exchange.
              </p>
            </div>
            <div className="border-l-2 border-[#0F5A3A]/30 pl-6">
              <h3 className="text-[#14291F] font-semibold mb-2">Shipping</h3>
              <p className="text-[#53655B] text-sm leading-relaxed">
                Complimentary insured shipping on all orders within the continental US. Contact us for
                international or expedited shipping options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="py-16 px-6 bg-[#F4F7F4]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">Come See Us</p>
          <h2 className="section-title mb-4">Visit Our Boutique</h2>
          <div className="divider-gold" />
          <p className="text-[#53655B] text-sm mb-8">25 W 47th St, Booth #8, New York, NY 10036</p>
          <div className="grid grid-cols-3 gap-4 text-sm text-[#5E6F66] mb-8">
            <div><p className="text-[#14291F] font-medium mb-1">Mon – Fri</p><p>10am – 5:30pm</p></div>
            <div><p className="text-[#14291F] font-medium mb-1">Saturday</p><p>11am – 5pm</p></div>
            <div><p className="text-[#14291F] font-medium mb-1">Sunday</p><p>Closed</p></div>
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
