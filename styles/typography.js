import { StyleSheet } from 'react-native';
import { typography, colors } from './theme';
import { moderateScale } from './scaling';

/**
 * Typography utilities for consistent text styling
 * Import and use these instead of inline fontSize/fontWeight definitions
 */

// ============================================================================
// HEADING STYLES
// ============================================================================

export const headingLarge = {
  fontSize: typography.h1.fontSize,
  fontWeight: typography.h1.fontWeight,
  lineHeight: typography.h1.lineHeight,
  color: colors.text.primary,
};

export const headingMedium = {
  fontSize: typography.h2.fontSize,
  fontWeight: typography.h2.fontWeight,
  lineHeight: typography.h2.lineHeight,
  color: colors.text.primary,
};

export const headingSmall = {
  fontSize: typography.h3.fontSize,
  fontWeight: typography.h3.fontWeight,
  lineHeight: typography.h3.lineHeight,
  color: colors.text.primary,
};

// ============================================================================
// BODY TEXT STYLES
// ============================================================================

export const bodyText = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  color: colors.text.primary,
};

export const bodyTextSmall = {
  fontSize: typography.bodySmall.fontSize,
  fontWeight: typography.bodySmall.fontWeight,
  lineHeight: typography.bodySmall.lineHeight,
  color: colors.text.primary,
};

export const bodyTextSecondary = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  color: colors.text.secondary,
};

// ============================================================================
// CAPTION/SMALL TEXT STYLES
// ============================================================================

export const captionText = {
  fontSize: typography.caption.fontSize,
  fontWeight: typography.caption.fontWeight,
  lineHeight: typography.caption.lineHeight,
  color: colors.text.primary,
};

export const captionTextSecondary = {
  fontSize: typography.caption.fontSize,
  fontWeight: typography.caption.fontWeight,
  lineHeight: typography.caption.lineHeight,
  color: colors.text.secondary,
};

// ============================================================================
// BUTTON TEXT STYLES
// ============================================================================

export const buttonText = {
  fontSize: typography.button.fontSize,
  fontWeight: typography.button.fontWeight,
  lineHeight: typography.button.lineHeight,
  color: colors.text.primary,
};

export const buttonTextSmall = {
  fontSize: typography.buttonSmall.fontSize,
  fontWeight: typography.buttonSmall.fontWeight,
  lineHeight: typography.buttonSmall.lineHeight,
  color: colors.text.primary,
};

// ============================================================================
// DISPLAY TEXT STYLES (for large numbers, scores)
// ============================================================================

export const displayText = {
  fontSize: typography.display.fontSize,
  fontWeight: typography.display.fontWeight,
  lineHeight: typography.display.lineHeight,
  color: colors.text.primary,
};

// ============================================================================
// SPECIAL TEXT STYLES
// ============================================================================

export const errorText = {
  fontSize: typography.caption.fontSize,
  fontWeight: typography.caption.fontWeight,
  lineHeight: typography.caption.lineHeight,
  color: colors.status.error,
};

export const successText = {
  fontSize: typography.caption.fontSize,
  fontWeight: typography.caption.fontWeight,
  lineHeight: typography.caption.lineHeight,
  color: colors.status.success,
};

export const linkText = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  color: colors.text.link,
  textDecorationLine: 'underline',
};

// ============================================================================
// SCALED TEXT UTILITIES (with moderateScale applied)
// ============================================================================

export const scaledHeadingLarge = {
  ...headingLarge,
  fontSize: moderateScale(headingLarge.fontSize),
};

export const scaledHeadingMedium = {
  ...headingMedium,
  fontSize: moderateScale(headingMedium.fontSize),
};

export const scaledHeadingSmall = {
  ...headingSmall,
  fontSize: moderateScale(headingSmall.fontSize),
};

export const scaledBodyText = {
  ...bodyText,
  fontSize: moderateScale(bodyText.fontSize),
};

export const scaledBodyTextSmall = {
  ...bodyTextSmall,
  fontSize: moderateScale(bodyTextSmall.fontSize),
};

export const scaledCaptionText = {
  ...captionText,
  fontSize: moderateScale(captionText.fontSize),
};

export const scaledButtonText = {
  ...buttonText,
  fontSize: moderateScale(buttonText.fontSize),
};

export const scaledDisplayText = {
  ...displayText,
  fontSize: moderateScale(displayText.fontSize),
};

// ============================================================================
// STYLESHEET EXPORT
// ============================================================================

export default StyleSheet.create({
  // Headings
  headingLarge,
  headingMedium,
  headingSmall,

  // Body text
  bodyText,
  bodyTextSmall,
  bodyTextSecondary,

  // Caption text
  captionText,
  captionTextSecondary,

  // Button text
  buttonText,
  buttonTextSmall,

  // Display text
  displayText,

  // Special text
  errorText,
  successText,
  linkText,

  // Scaled variants
  scaledHeadingLarge,
  scaledHeadingMedium,
  scaledHeadingSmall,
  scaledBodyText,
  scaledBodyTextSmall,
  scaledCaptionText,
  scaledButtonText,
  scaledDisplayText,
});
