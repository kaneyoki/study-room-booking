// ============================================================
// Theme Constants - VKU Study Room Booking App
// Premium dark theme with vibrant accent colors
// ============================================================

export const COLORS = {
  // Primary palette
  primary: '#6C63FF',
  primaryLight: '#8B83FF',
  primaryDark: '#4A42D4',
  primaryGlow: 'rgba(108, 99, 255, 0.3)',

  // Secondary / Accent
  secondary: '#FF6B6B',
  secondaryLight: '#FF8E8E',
  accent: '#00D4AA',
  accentLight: '#33DDBB',

  // Status colors
  available: '#00D4AA',
  occupied: '#FF6B6B',
  maintenance: '#FFB74D',
  cancelled: '#9E9E9E',

  // Backgrounds
  background: '#0A0A1A',
  surface: '#12122A',
  card: '#1A1A3E',
  cardHover: '#222255',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',

  // Text
  text: '#EAEAEA',
  textSecondary: '#8892B0',
  textMuted: '#5A6080',
  textInverse: '#0A0A1A',

  // Borders & Dividers
  border: '#2A2A4A',
  borderLight: '#3A3A5A',
  divider: '#1E1E3E',

  // Gradients
  gradientStart: '#6C63FF',
  gradientEnd: '#00D4AA',
  gradientWarm: '#FF6B6B',
  gradientWarmEnd: '#FFB74D',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(10, 10, 26, 0.95)',
  chipBg: 'rgba(108, 99, 255, 0.15)',
  chipActiveBg: 'rgba(108, 99, 255, 0.35)',
  inputBg: '#15152F',
  shadow: 'rgba(0, 0, 0, 0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 34,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  elevated: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
};

export const TIME_SLOTS = [
  { id: 0, label: '07:30 – 09:30', startTime: '07:30', endTime: '09:30' },
  { id: 1, label: '09:30 – 11:30', startTime: '09:30', endTime: '11:30' },
  { id: 2, label: '13:00 – 15:00', startTime: '13:00', endTime: '15:00' },
  { id: 3, label: '15:00 – 17:00', startTime: '15:00', endTime: '17:00' },
];

export const BUILDINGS: Array<{ id: string; label: string }> = [
  { id: 'A', label: 'Building A' },
  { id: 'B', label: 'Building B' },
  { id: 'C', label: 'Building C' },
  { id: 'V', label: 'Building V' },
];

export const EQUIPMENT_OPTIONS: Array<{ id: string; label: string; icon: string }> = [
  { id: 'Projector', label: 'Projector', icon: 'tv' },
  { id: 'Whiteboard', label: 'Whiteboard', icon: 'edit-3' },
  { id: 'High-spec PC', label: 'High-spec PC', icon: 'monitor' },
  { id: 'AC', label: 'AC', icon: 'wind' },
];
