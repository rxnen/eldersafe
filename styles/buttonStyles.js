import { StyleSheet } from 'react-native';
import { colors, spacing, shadows, borderRadius, typography, opacity } from './theme';
import { verticalScale, horizontalScale, moderateScale } from './scaling';

/**
 * Button state styles for interactive components
 * Use with Pressable component's style prop for dynamic states
 */

// ============================================================================
// PRIMARY BUTTON STYLES
// ============================================================================

export const primaryButton = {
  default: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(spacing.lg),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Accessibility minimum tap target
  },
  pressed: {
    backgroundColor: colors.interactive.pressed,
    borderColor: colors.accent.primary,
    opacity: opacity.pressed,
  },
  disabled: {
    backgroundColor: colors.interactive.disabled,
    borderColor: colors.border.secondary,
    opacity: opacity.disabled,
  },
  focus: {
    borderColor: colors.interactive.focus,
    borderWidth: 2,
  },
};

export const primaryButtonText = {
  default: {
    color: colors.text.primary,
    fontSize: moderateScale(typography.button.fontSize),
    fontWeight: typography.button.fontWeight,
  },
  disabled: {
    color: colors.text.disabled,
  },
};

// ============================================================================
// SECONDARY BUTTON STYLES (with background)
// ============================================================================

export const secondaryButton = {
  default: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: moderateScale(borderRadius.xl),
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...shadows.md,
  },
  pressed: {
    backgroundColor: colors.interactive.hover,
    opacity: opacity.pressed,
  },
  disabled: {
    backgroundColor: colors.interactive.disabled,
    borderColor: colors.border.secondary,
    opacity: opacity.disabled,
  },
  focus: {
    borderColor: colors.interactive.focus,
    borderWidth: 2,
  },
};

export const secondaryButtonText = {
  default: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  disabled: {
    color: colors.text.disabled,
  },
};

// ============================================================================
// ACCENT BUTTON STYLES (highlighted action)
// ============================================================================

export const accentButton = {
  default: {
    backgroundColor: colors.accent.primary,
    borderWidth: 0,
    borderRadius: borderRadius.md,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(spacing.lg),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...shadows.sm,
  },
  pressed: {
    backgroundColor: colors.accent.pressed,
    opacity: opacity.pressed,
  },
  disabled: {
    backgroundColor: colors.interactive.disabled,
    opacity: opacity.disabled,
  },
  focus: {
    borderColor: colors.border.primary,
    borderWidth: 2,
  },
};

export const accentButtonText = {
  default: {
    color: colors.text.primary,
    fontSize: moderateScale(typography.button.fontSize),
    fontWeight: typography.button.fontWeight,
  },
  disabled: {
    color: colors.text.disabled,
  },
};

// ============================================================================
// CARD/TOUCHABLE STYLES
// ============================================================================

export const cardTouchable = {
  default: {
    backgroundColor: colors.background.tertiary,
    borderRadius: moderateScale(borderRadius.lg),
    ...shadows.md,
  },
  pressed: {
    backgroundColor: colors.interactive.hover,
    opacity: opacity.pressed,
  },
};

export const dashboardCard = {
  default: {
    backgroundColor: colors.background.secondary,
    borderRadius: moderateScale(borderRadius.xl),
    ...shadows.md,
  },
  pressed: {
    backgroundColor: colors.interactive.hover,
    opacity: opacity.pressed,
    transform: [{ scale: 0.98 }], // Subtle scale down on press
  },
};

// ============================================================================
// ICON BUTTON STYLES (no background)
// ============================================================================

export const iconButton = {
  default: {
    padding: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get button style based on state
 * @param {object} buttonStyles - Button style object with default, pressed, disabled keys
 * @param {boolean} pressed - Whether button is pressed
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} focused - Whether button is focused
 * @returns {array} Array of styles to apply
 */
export const getButtonStyle = (buttonStyles, pressed, disabled = false, focused = false) => {
  const styles = [buttonStyles.default];

  if (disabled && buttonStyles.disabled) {
    styles.push(buttonStyles.disabled);
  } else if (pressed && buttonStyles.pressed) {
    styles.push(buttonStyles.pressed);
  } else if (focused && buttonStyles.focus) {
    styles.push(buttonStyles.focus);
  }

  return styles;
};

/**
 * Get button text style based on state
 * @param {object} textStyles - Text style object with default, disabled keys
 * @param {boolean} disabled - Whether button is disabled
 * @returns {array} Array of styles to apply
 */
export const getButtonTextStyle = (textStyles, disabled = false) => {
  const styles = [textStyles.default];

  if (disabled && textStyles.disabled) {
    styles.push(textStyles.disabled);
  }

  return styles;
};

// ============================================================================
// STYLESHEET EXPORT (for static styles)
// ============================================================================

export default StyleSheet.create({
  // Static button styles that don't need dynamic states
  primaryButton: primaryButton.default,
  primaryButtonPressed: primaryButton.pressed,
  primaryButtonDisabled: primaryButton.disabled,

  secondaryButton: secondaryButton.default,
  secondaryButtonPressed: secondaryButton.pressed,
  secondaryButtonDisabled: secondaryButton.disabled,

  accentButton: accentButton.default,
  accentButtonPressed: accentButton.pressed,
  accentButtonDisabled: accentButton.disabled,
});
