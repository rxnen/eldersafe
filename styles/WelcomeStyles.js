import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';
import { horizontalScale, verticalScale, moderateScale } from './scaling';

export { horizontalScale, verticalScale, moderateScale };

export const wstyles = StyleSheet.create({
  // ============================================================================
  // WELCOME PAGE STYLES
  // ============================================================================

  userOptions: {
    height: '90%',
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },

  optionText: {
    fontSize: moderateScale(typography.h2.fontSize),
    color: colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: horizontalScale(30),
    paddingVertical: verticalScale(10),
  },

  optionButton: {
    borderColor: colors.border.primary,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    height: '50%',
    marginVertical: verticalScale(20),
  },

  // ============================================================================
  // FORM INPUT STYLES
  // ============================================================================

  ageContainer: {
    marginLeft: horizontalScale(25),
    marginTop: verticalScale(20),
  },

  ageLabel: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginRight: horizontalScale(10),
    marginBottom: verticalScale(10),
    color: colors.text.primary,
  },

  ageInput: {
    fontSize: moderateScale(20),
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    width: '60%',
    height: verticalScale(40),
    paddingLeft: horizontalScale(10),
    color: colors.text.primary,
    textAlignVertical: 'center',
    paddingVertical: 0,
  },

  mobilityContainer: {
    marginTop: verticalScale(20),
    marginLeft: horizontalScale(25),
    width: horizontalScale(300),
    zIndex: 1,
  },

  visionContainer: {
    marginTop: verticalScale(20),
    marginLeft: horizontalScale(25),
    width: horizontalScale(300),
  },

  hearingContainer: {
    marginTop: verticalScale(20),
    marginLeft: horizontalScale(25),
    width: horizontalScale(300),
  },

  // ============================================================================
  // CHECKBOX STYLES
  // ============================================================================

  checkbox: {
    marginTop: verticalScale(10),
    borderWidth: 2,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxLabel: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    marginTop: verticalScale(10),
    marginLeft: horizontalScale(10),
  },

  // ============================================================================
  // BUTTON STYLES
  // ============================================================================

  submitContainer: {
    marginTop: verticalScale(30),
    width: '100%',
    alignItems: 'center',
  },

  submitButton: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    width: horizontalScale(300),
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitText: {
    color: colors.text.primary,
    fontSize: moderateScale(typography.body.fontSize),
    fontWeight: typography.button.fontWeight,
  },
});
