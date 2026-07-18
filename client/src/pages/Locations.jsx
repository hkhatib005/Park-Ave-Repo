const PIN = <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>;
const CLOCK = <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>;

const locations = [
  {
    city: 'New York',
    tagline: 'Historic Diamond District',
    address: '25 W 47th St, Booth #8\nNew York, NY 10036',
    mapQuery: '25 W 47th St, New York, NY 10036',
    phone: '(917) 599-3862',
    email: 'Parkavejewelers1@gmail.com',
  },
  {
    city: 'Dubai',
    tagline: 'Jumeira Third',
    address: 'Al Bailee Street, Jumeirah\nJumeira Third, Dubai\nUnited Arab Emirates',
    mapQuery: 'Al Bailee Street, Jumeirah 3, Dubai, United Arab Emirates',
  },
];

const hours = [
  ['Mon – Fri', '10am – 5:30pm'],
  ['Saturday', '11am – 5pm'],
  ['Sunday', 'Closed'],
];

export default function Locations() {
  return (
    <div className="pt-20 page-enter">
      {/* Header */}
      <div className="py-20 px-6 bg-[#002902] border-b border-[#005b04] text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)` }} />
        <div className="relative z-10">
          <p className="section-label">Visit Us</p>
          <h1 className="section-title mb-3">Locations</h1>
          <div className="divider-gold" />
          <p className="text-[#888] text-sm max-w-md mx-auto">
            Two boutiques, one standard of craftsmanship — New York's Diamond District and Dubai's Jumeirah.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#005b04]">
          {locations.map(loc => (
            <div key={loc.city} className="bg-[#0a1512] p-10">
              <p className="section-label">{loc.tagline}</p>
              <h2 className="font-display text-3xl font-bold text-white mb-6">{loc.city}</h2>

              <div className="map-frame mb-7">
                <iframe
                  title={`Map — ${loc.city} boutique`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&z=15&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-frame-corner" aria-hidden="true" />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-frame-cta"
                >
                  Get Directions
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M7 7h10v10"/></svg>
                </a>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-[#007605] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">{PIN}</svg>
                  </div>
                  <div>
                    <p className="text-[#555] text-[10px] tracking-[2px] uppercase mb-0.5">Address</p>
                    <p className="text-white text-sm whitespace-pre-line">{loc.address}</p>
                  </div>
                </div>

                {loc.phone && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 border border-[#007605] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#555] text-[10px] tracking-[2px] uppercase mb-0.5">Phone</p>
                      <p className="text-white text-sm">{loc.phone}</p>
                    </div>
                  </div>
                )}

                {loc.email && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 border border-[#007605] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#555] text-[10px] tracking-[2px] uppercase mb-0.5">Email</p>
                      <p className="text-white text-sm">{loc.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-[#007605] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">{CLOCK}</svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#555] text-[10px] tracking-[2px] uppercase mb-1.5">Hours</p>
                    <div className="space-y-1">
                      {hours.map(([day, time]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="text-[#666]">{day}</span>
                          <span className="text-white">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <p className="text-[#888] text-sm mb-6">Have a question before you visit?</p>
          <a href="/contact" className="btn-gold">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
