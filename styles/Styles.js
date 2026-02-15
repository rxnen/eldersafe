import { Platform, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export const styles = StyleSheet.create({

  // Basic Styles
    container: {
      flex: 1,
      flexDirection: 'column', 
      justifyContent: 'space-between',
      backgroundColor: '#1C1C1E',
    },

    header: {
      // flex: 1, 
      fontSize: 35, 
      fontWeight: 'bold',
      color: 'white',
      alignSelf: 'flex-start',
      marginLeft: horizontalScale(20),
      marginTop: verticalScale(10),
    },

    subheader: {
      // flex: 1,
      marginTop: verticalScale(10),
      marginLeft: horizontalScale(20),
      marginRight: horizontalScale(20),
      fontSize: moderateScale(20),
      color: 'white',
      alignSelf: 'flex-start',
    },
  
    // Home Page Styles
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
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreContainer: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: '#1C1C1E',
      alignItems: 'center',
      justifyContent: 'center',
    },
    score: {
      fontSize: moderateScale(50),
      fontWeight: 'bold',
      color: 'white',
    },
    scoreLabel: {
      fontSize: moderateScale(20),
      marginTop: verticalScale(20),
      marginHorizontal: horizontalScale(20),
    },

    scoreLabelText: {
      fontSize: moderateScale(20),
      color: 'white',
      textAlign: 'center',
    },

    scoreLabelSubtext: {
      fontSize: moderateScale(15),
      marginTop: verticalScale(10),
      marginHorizontal: horizontalScale(20),
      color: 'lightblue',
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
      backgroundColor: '#2C2C2E',
      borderRadius: moderateScale(20),
      marginBottom: 3.5,
      marginRight: 15,
      marginLeft: 15,
      paddingVertical: verticalScale(15),
      paddingHorizontal: horizontalScale(10),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5, 
    },

    dashboardNumber: {
      fontSize: moderateScale(50),
      fontWeight: 'bold',
      color: 'white',
    },

    dashboardText: {
      fontSize: moderateScale(20),
      color: 'white',
      textAlign: 'center',
    },

    
    // Rooms Page Styles

    roomHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center', 
    },

    plus: {
      fontSize: moderateScale(35),
      color: 'white',
      marginTop: verticalScale(10),
      marginRight: horizontalScale(20),
    },

    noRooms: {
        fontSize: moderateScale(20),
        textAlign: 'center',
        color: 'white',
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
      paddingLeft: horizontalScale(16),
      paddingRight: horizontalScale(16),
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(12),
      marginBottom: verticalScale(12),
      backgroundColor: '#1E1E1E',
      borderRadius: moderateScale(10),
      color: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },

    roomText: {
      fontSize: moderateScale(20),
      color: 'white',
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
      color: 'white',
      fontSize: moderateScale(20),
      marginTop: verticalScale(12),
      marginBottom: verticalScale(30),
      textDecorationLine: 'underline',
    },

    roomHeaderCont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1C1C1E',
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#24a0ed',
    },

    roomHeader: {
      position: 'absolute',
      alignItems: 'center',
      fontSize: moderateScale(25),
      fontWeight: 'bold',
      color: 'white',
    },

    roomHeaderText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: moderateScale(25),
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
      color: 'white',
    },

    inputContainer: {
      width: '80%',
      height: verticalScale(40),
      marginHorizontal: "10%",
      marginTop: verticalScale(20),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2C2C2E',
      borderRadius: 8,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    input: {
      fontSize: moderateScale(18),
      width: '100%',
      height: '100%',
      textAlign: 'left',
      // paddingVertical: verticalScale(8),
      paddingLeft: horizontalScale(10),
      borderBottomColor: '#24a0ed',
      borderBottomWidth: 1,
      color: 'white',
    },

    assessment: {
      flex: 1,
      flexDirection: 'column',
      marginTop: verticalScale(20),
      width: '100%',
    },

    assessmentText: {
      fontSize: moderateScale(20),
      width: '60%',
      color: 'white',
    },

    assessmentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: '10%',
      marginLeft: '10%',
      marginTop: verticalScale(10),
      marginBottom: verticalScale(10)
    },

    assessmentCheckbox: {
      width: horizontalScale(30),
      height: verticalScale(30),
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },

    assessmentButton: {
      backgroundColor: '#1C1C1E',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      width: '80%',
      height: verticalScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(20),
    },

    assessmentButtonText: {
      color: 'white',
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
      color: 'white',
      marginBottom: '10%',
    },

    roomAddedText: {
      fontSize: moderateScale(20),
      textAlign: 'center',
      color: 'white',
      marginTop: '10%',
    },

    roomAddedButton: {
      backgroundColor: '#1C1C1E',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      width: '80%',
      height: verticalScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(20),
    },

    roomAddedButtonText: {
      color: 'white',
      fontSize: moderateScale(20),
      fontWeight: 'bold',
    },

    reportHeader: {
      fontSize: moderateScale(25),
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
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
      color: 'white',
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
      backgroundColor: '#1C1C1E',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
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
      color: 'white',
      fontSize: moderateScale(20),
      fontWeight: 'bold',
    },

    // Tips Page Styles

    tipsList: {
      width: '100%',
      marginTop: verticalScale(20),
    },

    noProductsText: {
      fontSize: moderateScale(20),
      textAlign: 'center',
      color: 'white',
      marginTop: '80%',
      marginHorizontal: horizontalScale(25),
    },

    tipSectionHeader: {
      fontSize: moderateScale(25),
      fontWeight: 'bold',
      backgroundColor: '#1C1C1E',
      color: 'white',
      marginLeft: '5%',
      paddingTop: verticalScale(15),
    },

    tip: {
      width: '80%',   
      marginTop: verticalScale(5),
      marginBottom: verticalScale(5),
      borderRadius: 10,
      backgroundColor: '#1C1C1E',
      padding: horizontalScale(20),
      flexDirection: 'row',
      alignItems: 'center',
    },

    tipImage: {
      width: horizontalScale(80),
      height: verticalScale(80),
      borderRadius: 5,
    },

    tipTextContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: horizontalScale(20),
    },

    tipText: {
      fontSize: moderateScale(20),
      color: 'white',
      fontWeight: 'bold',
    },

    tipDescription: {
      fontSize: moderateScale(15),
      color: 'white',
      marginBottom: verticalScale(10),
    },

    tipImportance: {
      fontSize: moderateScale(15),
      color: 'white',
    },

    affiliateNote: {
      fontSize: moderateScale(15),
      color: 'white',
      marginTop: verticalScale(10),
      marginBottom: verticalScale(20),
      marginLeft: horizontalScale(20),
    },

    hazardContainer: {
      width: '100%',
      height: '95%',
      marginTop: verticalScale(20),
      marginBottom: verticalScale(40),
      borderRadius: 10,
      backgroundColor: '#1C1C1E',
    },

    hazardHeader: {
      fontSize: moderateScale(25),
      fontWeight: 'bold',
      marginLeft: horizontalScale(25),
      marginBottom: verticalScale(10),
      color: 'white',
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
      width: '80%'
    },

    hazardIconStyle: {
      width: horizontalScale(75),
      color: 'white',
    },

    hazardIcon: {
      marginLeft: horizontalScale(20),
      marginRight: horizontalScale(20),
    },

    hazardText: {
      fontSize: moderateScale(20),
      color: 'white',
    },

    hazardRoom: {
      fontSize: moderateScale(15),
    },

    tipFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
    },

    tipFooterText: {
      fontSize: moderateScale(15),
      color: 'white',
    },

    tipFooterButton: {
      backgroundColor: '#1C1C1E',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      width: '80%',
      height: verticalScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: verticalScale(20),
    },

    tipFooterButtonText: {
      color: 'white',
      fontSize: moderateScale(20),
      fontWeight: 'bold',
    },

  });
  