import { Platform, StyleSheet } from 'react-native';
import { colors, spacing, shadows, borderRadius, typography } from './theme';
import { horizontalScale, verticalScale, moderateScale } from './scaling';

export { horizontalScale, verticalScale, moderateScale };

export const styles = StyleSheet.create({

  // ============================================================================
  // LAYOUT STYLES
  // ============================================================================

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: colors.background.primary,
  },

  // ============================================================================
  // TEXT STYLES
  // ============================================================================

  header: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.text.primary,
    alignSelf: 'flex-start',
    marginLeft: horizontalScale(20),
    marginTop: verticalScale(10),
  },

  subheader: {
    marginTop: verticalScale(10),
    marginLeft: horizontalScale(20),
    marginRight: horizontalScale(20),
    fontSize: moderateScale(20),
    color: colors.text.primary,
    alignSelf: 'flex-start',
  },

  // ============================================================================
  // HOME PAGE STYLES
  // ============================================================================

  outerRing: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(40),
  },

  gradientRing: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  score: {
    fontSize: moderateScale(typography.display.fontSize),
    fontWeight: typography.display.fontWeight,
    color: colors.text.primary,
  },

  scoreLabel: {
    fontSize: moderateScale(20),
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(20),
  },

  scoreLabelText: {
    fontSize: moderateScale(20),
    color: colors.text.primary,
    textAlign: 'center',
  },

  scoreLabelSubtext: {
    fontSize: moderateScale(typography.caption.fontSize),
    marginTop: verticalScale(10),
    marginHorizontal: horizontalScale(20),
    color: colors.accent.secondary,
    textAlign: 'center',
  },

  dashboard: {
    flex: 1,
    flexDirection: 'row',
    marginTop: verticalScale(50),
    width: '100%',
    justifyContent: 'space-evenly',
  },

  dashboardButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: moderateScale(borderRadius.xl),
    marginBottom: 3.5,
    marginRight: spacing.md,
    marginLeft: spacing.md,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(10),
    ...shadows.md,
  },

  dashboardNumber: {
    fontSize: moderateScale(typography.display.fontSize),
    fontWeight: typography.display.fontWeight,
    color: colors.text.primary,
  },

  dashboardText: {
    fontSize: moderateScale(20),
    color: colors.text.primary,
    textAlign: 'center',
  },

  // ============================================================================
  // ROOMS PAGE STYLES
  // ============================================================================

  roomHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  plus: {
    fontSize: moderateScale(typography.h1.fontSize),
    color: colors.text.primary,
    marginTop: verticalScale(10),
    marginRight: horizontalScale(20),
  },

  noRooms: {
    fontSize: moderateScale(20),
    textAlign: 'center',
    color: colors.text.primary,
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  room: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(100),
    alignItems: 'center',
    marginRight: horizontalScale(12),
    marginLeft: horizontalScale(12),
    paddingLeft: horizontalScale(spacing.md),
    paddingRight: horizontalScale(spacing.md),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(12),
    marginBottom: verticalScale(12),
    backgroundColor: colors.background.tertiary,
    borderRadius: moderateScale(borderRadius.lg),
    ...shadows.md,
  },

  roomText: {
    fontSize: moderateScale(20),
    color: colors.text.primary,
  },

  currentRooms: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    marginTop: verticalScale(20),
  },

  roomFooter: {
    marginTop: verticalScale(20),
  },

  roomFooterText: {
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: moderateScale(20),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(30),
    textDecorationLine: 'underline',
  },

  roomHeaderCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.accent,
  },

  roomHeader: {
    position: 'absolute',
    alignItems: 'center',
    fontSize: moderateScale(typography.h3.fontSize),
    fontWeight: typography.h3.fontWeight,
    color: colors.text.primary,
  },

  roomHeaderText: {
    color: colors.text.primary,
    fontWeight: typography.h3.fontWeight,
    fontSize: moderateScale(typography.h3.fontSize),
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },

  backButton: {
    position: 'absolute',
    left: 0,
    marginLeft: horizontalScale(10),
    marginTop: verticalScale(10),
  },

  saveButton: {
    position: 'absolute',
    right: 0,
    marginRight: horizontalScale(10),
    marginTop: verticalScale(10),
  },

  saveText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },

  inputHeader: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: horizontalScale(25),
    marginRight: horizontalScale(25),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    color: colors.text.primary,
  },

  inputContainer: {
    width: '80%',
    height: verticalScale(40),
    marginHorizontal: '10%',
    marginTop: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  input: {
    fontSize: moderateScale(typography.bodySmall.fontSize),
    width: '100%',
    height: '100%',
    textAlign: 'left',
    paddingLeft: horizontalScale(10),
    borderBottomColor: colors.border.accent,
    borderBottomWidth: 1,
    color: colors.text.primary,
  },

  // ============================================================================
  // ASSESSMENT STYLES
  // ============================================================================

  assessment: {
    flex: 1,
    flexDirection: 'column',
    marginTop: verticalScale(20),
    width: '100%',
  },

  assessmentText: {
    fontSize: moderateScale(20),
    width: '60%',
    color: colors.text.primary,
  },

  assessmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '10%',
    marginLeft: '10%',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },

  assessmentCheckbox: {
    width: horizontalScale(30),
    height: verticalScale(30),
    borderWidth: 2,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  assessmentButton: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    width: '80%',
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
  },

  assessmentButtonText: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },

  roomAddedContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roomAddedHeader: {
    fontSize: moderateScale(40),
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text.primary,
    marginBottom: '10%',
  },

  roomAddedText: {
    fontSize: moderateScale(20),
    textAlign: 'center',
    color: colors.text.primary,
    marginTop: '10%',
  },

  roomAddedButton: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    width: '80%',
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
  },

  roomAddedButtonText: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },

  // ============================================================================
  // REPORT STYLES
  // ============================================================================

  reportHeader: {
    fontSize: moderateScale(typography.h3.fontSize),
    fontWeight: typography.h3.fontWeight,
    textAlign: 'center',
    color: colors.text.primary,
    marginTop: verticalScale(30),
  },

  reportItem: {
    marginLeft: horizontalScale(25),
    marginRight: horizontalScale(25),
    marginTop: verticalScale(25),
    marginBottom: verticalScale(5),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '80%',
  },

  reportText: {
    fontSize: moderateScale(20),
    textAlign: 'left',
    color: colors.text.primary,
    marginLeft: horizontalScale(25),
  },

  reportButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: verticalScale(20),
  },

  reportOK: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: horizontalScale(25),
    marginRight: horizontalScale(25),
    marginTop: verticalScale(30),
    width: '80%',
    alignSelf: 'center',
  },

  reportOKText: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },

  // ============================================================================
  // TIPS PAGE STYLES
  // ============================================================================

  tipsList: {
    width: '100%',
    marginTop: verticalScale(20),
  },

  noProductsText: {
    fontSize: moderateScale(20),
    textAlign: 'center',
    color: colors.text.primary,
    marginTop: '80%',
    marginHorizontal: horizontalScale(25),
  },

  tipSectionHeader: {
    fontSize: moderateScale(typography.h3.fontSize),
    fontWeight: typography.h3.fontWeight,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    marginLeft: '5%',
    paddingTop: verticalScale(15),
  },

  tip: {
    width: '80%',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(5),
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    padding: horizontalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },

  tipImage: {
    width: horizontalScale(80),
    height: verticalScale(80),
    borderRadius: borderRadius.sm,
  },

  tipTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: horizontalScale(20),
  },

  tipText: {
    fontSize: moderateScale(20),
    color: colors.text.primary,
    fontWeight: 'bold',
  },

  tipDescription: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.text.primary,
    marginBottom: verticalScale(10),
  },

  tipImportance: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.text.primary,
  },

  affiliateNote: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.text.primary,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
    marginLeft: horizontalScale(20),
  },

  // ============================================================================
  // HAZARD STYLES
  // ============================================================================

  hazardContainer: {
    width: '100%',
    height: '95%',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
  },

  hazardHeader: {
    fontSize: moderateScale(typography.h3.fontSize),
    fontWeight: typography.h3.fontWeight,
    marginLeft: horizontalScale(25),
    marginBottom: verticalScale(10),
    color: colors.text.primary,
  },

  hazard: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    marginLeft: horizontalScale(25),
    marginRight: horizontalScale(25),
  },

  hazardLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },

  hazardIconStyle: {
    width: horizontalScale(75),
    color: colors.text.primary,
  },

  hazardIcon: {
    marginLeft: horizontalScale(20),
    marginRight: horizontalScale(20),
  },

  hazardText: {
    fontSize: moderateScale(20),
    color: colors.text.primary,
  },

  hazardRoom: {
    fontSize: moderateScale(typography.caption.fontSize),
  },

  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },

  tipFooterText: {
    fontSize: moderateScale(typography.caption.fontSize),
    color: colors.text.primary,
  },

  tipFooterButton: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    width: '80%',
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
  },

  tipFooterButtonText: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
});
