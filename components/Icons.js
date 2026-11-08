const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Cart = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" {...base}><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" /></svg>
);
export const Drop = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z" /></svg>
);
export const Check = ({ size = 20, color = 'var(--success)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" {...base} stroke={color} style={{ flex: 'none', marginTop: 1 }}><path d="M5 12l5 5L20 7" /></svg>
);
export const Bolt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" {...base}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
);
export const Clock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Chat = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
);
export const Swap = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" {...base}><path d="M7 7h11l-3-3M17 17H6l3 3" /></svg>
);
export const CarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" {...base}><path d="M5 17h14M6 17l1.5-6h9L18 17M7.5 11l1.5-4h6l1.5 4M7 20v-3M17 20v-3" /></svg>
);

export function CarPlaceholder({ label = 'Foto del auto (referencial)' }) {
  return (
    <svg width="70%" viewBox="0 0 200 80" role="img" aria-label={label}>
      <path d="M8 58 L16 44 Q24 36 48 34 L74 20 Q84 14 110 14 L134 15 Q150 17 166 32 L186 36 Q196 39 196 50 L196 60 L8 60 Z" fill="#121821" opacity="0.85" />
      <path d="M80 24 L108 19 L132 20 Q144 22 154 32 L84 33 Z" fill="#ffffff" opacity="0.35" />
      <circle cx="50" cy="60" r="13" fill="#121821" /><circle cx="50" cy="60" r="5" fill="#e2e2dc" />
      <circle cx="156" cy="60" r="13" fill="#121821" /><circle cx="156" cy="60" r="5" fill="#e2e2dc" />
    </svg>
  );
}
