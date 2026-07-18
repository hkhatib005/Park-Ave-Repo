// Hand-drawn line-art marks for each category — replaces emoji/generic
// icon-font glyphs so the site doesn't read as a template. One consistent
// stroke weight and viewBox across the set; each mark reflects the actual
// silhouette of the piece rather than a generic gem/sparkle stand-in.

const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function RingIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <circle cx="24" cy="29" r="11" />
      <path d="M18.5 18 L24 8 L29.5 18 Z" />
      <path d="M19.6 18 L28.4 18" />
      <path d="M21.3 18 L24 13.2 L26.7 18" opacity="0.55" />
    </svg>
  );
}

export function NecklaceIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M9 9 C9 26 15 34 24 34 C33 34 39 26 39 9" />
      <path d="M19.5 27 L24 39 L28.5 27 Z" />
      <path d="M20.6 27 L27.4 27" opacity="0.55" />
    </svg>
  );
}

export function BraceletIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <ellipse cx="24" cy="24" rx="16.5" ry="10.5" />
      <ellipse cx="24" cy="24" rx="11.5" ry="6.5" opacity="0.4" />
      <path d="M13 17 L16 24 L13 31" opacity="0.55" />
      <path d="M35 17 L32 24 L35 31" opacity="0.55" />
    </svg>
  );
}

export function EarringIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M18 9 a6 6 0 1 0 0.01 0" />
      <line x1="24" y1="21" x2="24" y2="27" />
      <path d="M17.5 27 L24 41 L30.5 27 Z" />
      <path d="M19.3 27 L28.7 27" opacity="0.55" />
    </svg>
  );
}

export function WatchIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M18.5 15 L18.5 9 L29.5 9 L29.5 15" />
      <path d="M18.5 33 L18.5 39 L29.5 39 L29.5 33" />
      <circle cx="24" cy="24" r="10.5" />
      <path d="M24 18.5 L24 24 L28 26.5" />
    </svg>
  );
}

export function CustomIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...common} {...props}>
      <path d="M11 33 L30 14 L34 18 L15 37 L10 38 Z" />
      <path d="M27 17 L31 21" />
      <path d="M36 12 L39 9 M39 12 L36 9" opacity="0.55" />
    </svg>
  );
}

export const CATEGORY_ICONS = {
  Rings: RingIcon,
  Necklaces: NecklaceIcon,
  Pendants: NecklaceIcon,
  Bracelets: BraceletIcon,
  Earrings: EarringIcon,
  Watches: WatchIcon,
  'Custom Jewellery': CustomIcon,
};
