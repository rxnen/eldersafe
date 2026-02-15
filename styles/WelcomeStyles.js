import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export const wstyles = StyleSheet.create({
    // Welcome Page Styles
    userOptions: {
        height: "90%",
        width: "100%",
        alignItems: 'center',
        marginTop: verticalScale(50),
    },
    optionText: {
        fontSize: moderateScale(28),
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: horizontalScale(30),
        paddingVertical: verticalScale(10),
    },
    optionButton: {
        borderColor: 'white',
        backgroundColor: '#1C1C1E',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: "80%",
        height: "50%",
        marginVertical: verticalScale(20),
    },
    ageContainer: {
        marginLeft: horizontalScale(25),
        marginTop: verticalScale(20),
    },
    ageLabel: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        marginRight: horizontalScale(10),
        marginBottom: verticalScale(10),
        color: 'white',
    },
    
    ageInput: {
        fontSize: moderateScale(20),
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        width: '60%',
        height: verticalScale(40),
        paddingLeft: horizontalScale(10),
        color: 'white',

        textAlignVertical: 'center', // 👈 ADD THIS
        paddingVertical: 0, // 👈 AND THIS
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

    checkbox: {
        marginTop: verticalScale(10),
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkboxLabel: {
        color: 'white',
        fontSize: moderateScale(20),
        marginTop: verticalScale(10),
        marginLeft: horizontalScale(10),
    },

    submitContainer: {
        marginTop: verticalScale(30),
        width: '100%',
        alignItems: 'center',
    },

    submitButton: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        width: horizontalScale(300),
        height: verticalScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },

    submitText: {
        color: 'white',
        fontSize: moderateScale(20),
        fontWeight: 'bold',
    },

});