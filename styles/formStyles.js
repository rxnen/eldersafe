import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';
import { verticalScale, horizontalScale, moderateScale } from './scaling';

/**
 * Form input and validation styles
 * Provides consistent styling for inputs across different states
 */

// ============================================================================
// INPUT CONTAINER STYLES
// ============================================================================

export const inputContainer = {
  default: {
    width: '80%',
    minHeight: verticalScale(40),
    marginHorizontal: '10%',
    marginTop: verticalScale(20),
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  focus: {
    borderColor: colors.border.focus,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.border.error,
    borderWidth: 2,
  },
  success: {
    borderColor: colors.status.success,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: colors.interactive.disabled,
    borderColor: colors.border.secondary,
    opacity: 0.6,
  },
};

// ============================================================================
// TEXT INPUT STYLES
// ============================================================================

export const textInput = {
  default: {
    fontSize: moderateScale(typography.bodySmall.fontSize),
    color: colors.text.primary,
    width: '100%',
    height: '100%',
    paddingHorizontal: horizontalScale(spacing.sm),
    paddingVertical: verticalScale(spacing.sm),
  },
  placeholder: {
    color: colors.text.secondary,
  },
  disabled: {
    color: colors.text.disabled,
  },
};

// ============================================================================
// LABEL STYLES
// ============================================================================

export const inputLabel = {
  default: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: verticalScale(10),
  },
  required: {
    // Add asterisk or indicator for required fields
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: verticalScale(10),
  },
  error: {
    color: colors.status.error,
  },
};

// ============================================================================
// ERROR MESSAGE STYLES
// ============================================================================

export const errorMessage = {
  container: {
    marginTop: verticalScale(spacing.xs),
    marginHorizontal: '10%',
    width: '80%',
  },
  text: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.status.error,
    lineHeight: typography.caption.lineHeight,
  },
};

// ============================================================================
// SUCCESS MESSAGE STYLES
// ============================================================================

export const successMessage = {
  container: {
    marginTop: verticalScale(spacing.xs),
    marginHorizontal: '10%',
    width: '80%',
  },
  text: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.status.success,
    lineHeight: typography.caption.lineHeight,
  },
};

// ============================================================================
// HELPER TEXT STYLES
// ============================================================================

export const helperText = {
  container: {
    marginTop: verticalScale(spacing.xs),
    marginHorizontal: '10%',
    width: '80%',
  },
  text: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.text.secondary,
    lineHeight: typography.caption.lineHeight,
  },
};

// ============================================================================
// FORM GROUP STYLES
// ============================================================================

export const formGroup = {
  container: {
    marginTop: verticalScale(spacing.lg),
    marginHorizontal: horizontalScale(25),
    width: horizontalScale(300),
  },
  label: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: verticalScale(10),
  },
};

// ============================================================================
// VALIDATION INDICATOR STYLES
// ============================================================================

export const validationIndicator = {
  success: {
    width: horizontalScale(20),
    height: verticalScale(20),
    borderRadius: borderRadius.round,
    backgroundColor: colors.status.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    width: horizontalScale(20),
    height: verticalScale(20),
    borderRadius: borderRadius.round,
    backgroundColor: colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get input container style based on state
 * @param {boolean} focused - Whether input is focused
 * @param {boolean} hasError - Whether input has validation error
 * @param {boolean} isSuccess - Whether input validation succeeded
 * @param {boolean} disabled - Whether input is disabled
 * @returns {array} Array of styles to apply
 */
export const getInputContainerStyle = (focused, hasError, isSuccess, disabled = false) => {
  const styles = [inputContainer.default];

  if (disabled) {
    styles.push(inputContainer.disabled);
  } else if (hasError) {
    styles.push(inputContainer.error);
  } else if (isSuccess) {
    styles.push(inputContainer.success);
  } else if (focused) {
    styles.push(inputContainer.focus);
  }

  return styles;
};

/**
 * Get input text style based on state
 * @param {boolean} disabled - Whether input is disabled
 * @returns {array} Array of styles to apply
 */
export const getInputTextStyle = (disabled = false) => {
  const styles = [textInput.default];

  if (disabled) {
    styles.push(textInput.disabled);
  }

  return styles;
};

/**
 * Get label style based on state
 * @param {boolean} hasError - Whether associated input has error
 * @param {boolean} required - Whether field is required
 * @returns {array} Array of styles to apply
 */
export const getLabelStyle = (hasError, required = false) => {
  const styles = required ? [inputLabel.required] : [inputLabel.default];

  if (hasError) {
    styles.push(inputLabel.error);
  }

  return styles;
};

// ============================================================================
// STYLESHEET EXPORT
// ============================================================================

export default StyleSheet.create({
  // Input styles
  inputContainerDefault: inputContainer.default,
  inputContainerFocus: inputContainer.focus,
  inputContainerError: inputContainer.error,
  inputContainerSuccess: inputContainer.success,
  inputContainerDisabled: inputContainer.disabled,

  textInputDefault: textInput.default,
  textInputDisabled: textInput.disabled,

  // Label styles
  labelDefault: inputLabel.default,
  labelRequired: inputLabel.required,
  labelError: inputLabel.error,

  // Message styles
  errorMessageContainer: errorMessage.container,
  errorMessageText: errorMessage.text,
  successMessageContainer: successMessage.container,
  successMessageText: successMessage.text,
  helperTextContainer: helperText.container,
  helperTextText: helperText.text,

  // Form group
  formGroupContainer: formGroup.container,
  formGroupLabel: formGroup.label,

  // Validation indicators
  validationSuccess: validationIndicator.success,
  validationError: validationIndicator.error,
});
