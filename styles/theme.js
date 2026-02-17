/**
 * ElderSafe Design System Theme
 *
 * Central design tokens for colors, typography, spacing, shadows, and more.
 * Import this theme throughout the app for consistent styling.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Background colors
  background: {
    primary: '#1C1C1E',      // Main app background
    secondary: '#2C2C2E',     // Cards, elevated elements
    tertiary: '#1E1E1E',      // Alternative card background
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  },

  // Accent colors
  accent: {
    primary: '#24a0ed',       // Main accent/brand color (blue)
    secondary: '#87CEEB',     // Light blue (lightblue)
    pressed: '#1a7ac4',       // Darker blue for pressed state
    light: '#40b4f5',         // Lighter blue for hover
  },

  // Text colors
  text: {
    primary: '#FFFFFF',       // Main text color
    secondary: '#A0A0A0',     // Secondary/muted text
    disabled: '#666666',      // Disabled state text
    inverse: '#000000',       // Text on light backgrounds
    link: '#24a0ed',          // Link text color
  },

  // Interactive states
  interactive: {
    default: '#2C2C2E',       // Default button/card background
    hover: '#3C3C3E',         // Hover state (web)
    pressed: 'rgba(36, 160, 237, 0.15)', // Pressed overlay
    focus: '#24a0ed',         // Focus border color
    disabled: '#2C2C2E',      // Disabled background
  },

  // Status colors
  status: {
    success: '#4CAF50',       // Success/safe indicators
    warning: '#FF9800',       // Warning indicators
    error: '#F44336',         // Error/hazard indicators
    info: '#2196F3',          // Info indicators
  },

  // Border colors
  border: {
    primary: '#FFFFFF',       // Main border color
    secondary: '#666666',     // Muted borders
    accent: '#24a0ed',        // Accent borders
    focus: '#24a0ed',         // Focus state borders
    error: '#F44336',         // Error state borders
  },

  // Shadow colors
  shadow: {
    default: '#000000',       // Shadow color
  },

  // Gradient colors (for score ring)
  gradient: {
    green: ['#4CAF50', '#81C784'],
    yellow: ['#FFC107', '#FFD54F'],
    orange: ['#FF9800', '#FFB74D'],
    red: ['#F44336', '#E57373'],
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    default: '-apple-system, Roboto, sans-serif',
    // Add custom fonts here if needed
  },

  // Heading styles
  h1: {
    fontSize: 35,
    fontWeight: 'bold',
    lineHeight: 42,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  h3: {
    fontSize: 25,
    fontWeight: 'bold',
    lineHeight: 30,
  },

  // Body text
  body: {
    fontSize: 20,
    fontWeight: 'normal',
    lineHeight: 28,
  },
  bodySmall: {
    fontSize: 18,
    fontWeight: 'normal',
    lineHeight: 24,
  },

  // Caption/small text
  caption: {
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 20,
  },

  // Button text
  button: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },

  // Large display text (like scores)
  display: {
    fontSize: 50,
    fontWeight: 'bold',
    lineHeight: 60,
  },
};

// ============================================================================
// SPACING
// ============================================================================

// Based on 8px grid system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Semantic spacing for specific use cases
export const layoutSpacing = {
  screenPadding: spacing.lg,     // 24px - standard screen padding
  sectionGap: spacing.xl,        // 32px - gap between major sections
  cardPadding: spacing.md,       // 16px - padding inside cards
  buttonPadding: spacing.sm,     // 8px - padding inside buttons
  inputPadding: spacing.sm,      // 8px - padding inside inputs
  itemGap: spacing.md,           // 16px - gap between list items
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: {
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Android
  },
  md: {
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Android
  },
  lg: {
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android
  },
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  sm: 5,
  md: 8,
  lg: 10,
  xl: 20,
  round: 100, // For circular elements
};

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  overlay: 2000,
  modal: 3000,
  toast: 4000,
};

// ============================================================================
// OPACITY
// ============================================================================

export const opacity = {
  disabled: 0.5,
  pressed: 0.7,
  overlay: 0.5,
};

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const accessibility = {
  // Minimum tap target size
  minTapTarget: {
    width: 44,  // iOS minimum
    height: 44,
  },
  minTapTargetAndroid: {
    width: 48,  // Android minimum
    height: 48,
  },

  // Text size constraints
  minTextSize: 16, // Minimum for body text (accessibility)

  // Contrast ratios (WCAG AA)
  contrastRatios: {
    normal: 4.5,    // Normal text
    large: 3.0,     // Large text (18pt+ or 14pt+ bold)
  },
};

// ============================================================================
// ANIMATION
// ============================================================================

export const animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    default: 'ease-in-out',
    in: 'ease-in',
    out: 'ease-out',
  },
};

// ============================================================================
// EXPORT DEFAULT THEME
// ============================================================================

export default {
  colors,
  typography,
  spacing,
  layoutSpacing,
  shadows,
  borderRadius,
  zIndex,
  opacity,
  accessibility,
  animation,
};
