// Shared Framer Motion animation variants

export const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const slideDown = {
  hidden:  { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const staggerContainer = (stagger = 0.08) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger } },
});

export const cardHover = {
  rest:  { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  hover: { y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)', transition: { duration: 0.25 } },
};

export const buttonTap = {
  whileHover: { scale: 1.04 },
  whileTap:   { scale: 0.95 },
};

export const pageTransition = {
  initial:   { opacity: 0, y: 16 },
  animate:   { opacity: 1, y: 0 },
  exit:      { opacity: 0, y: -16 },
  transition:{ duration: 0.35, ease: 'easeOut' },
};
