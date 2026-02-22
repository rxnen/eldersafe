import { StyleSheet, Text, View, Pressable, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, StatusBar, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles';
import {wstyles} from '../styles/WelcomeStyles';
import { colors, spacing, borderRadius } from '../styles/theme';
import { primaryButton, primaryButtonText, getButtonStyle, getButtonTextStyle} from '../styles/buttonStyles';
import formStyles, { getInputContainerStyle, errorMessage } from '../styles/formStyles';
import { ExpoStatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { verticalScale, horizontalScale, moderateScale } from '../styles/Styles';
import {fetchRooms, addRoom, deleteRoomData} from '../scripting/rooms';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackEvent } from "@aptabase/react-native";

export default function FirstLoad({navigation}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'I walk without an aid', value: 'none'},
        {label: 'I use a cane', value: 'cane'},
        {label: 'I use a walker', value: 'walker'},
        {label: 'I use a wheelchair', value: 'wheelchair'},
        ]);

    const [age, setAge] = useState(0);
    const [vision, setVision] = useState(false);
    const [hearing, setHearing] = useState(false);

    const [ageError, setAgeError] = useState(null);
    const [mobilityError, setMobilityError] = useState(null);
    const [ageFocused, setAgeFocused] = useState(false);

    const [userType, setUserType] = useState(null);

    useEffect(() => {

        removeNav = navigation.addListener('focus', (e) => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                  display: 'none',
                }
              });
              return () => navigation.getParent()?.setOptions({
                tabBarStyle: undefined
              });
            });

        addNav = navigation.addListener('beforeRemove', (e) => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    backgroundColor: colors.background.primary,
                    display: 'flex',
                    borderTopWidth: 0,
                    elevation: 0,
                }
            });
            return () => navigation.getParent()?.setOptions({
                tabBarStyle: undefined
            });
        });
    })


    return (
        <SafeAreaView style={modernStyles.container} edges={['top', 'left', 'right']}>
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                {/* Progress Indicator */}
                <View style={modernStyles.progressContainer}>
                    <View style={modernStyles.progressBar}>
                        <View style={[modernStyles.progressFill, { width: userType ? '100%' : '50%' }]} />
                    </View>
                    <Text style={modernStyles.stepText}>
                        Step {userType ? '2' : '1'} of 2
                    </Text>
                </View>

                {/* Header */}
                <Text style={modernStyles.title}>
                    {userType == null ? "Who is using ElderSafe?" : "Tell Us More"}
                </Text>
                <Text style={modernStyles.subtitle}>
                    {userType == "caregiver" ? "Information about the senior you're caring for" : userType == "senior" ? "Help us personalize your experience" : "This helps us provide better safety recommendations"}
                </Text>
                {userType == null && (
                    <View style={modernStyles.cardsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                modernStyles.card,
                                pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={() => {
                                setItems([
                                    {label: 'I walk without an aid', value: 'none'},
                                    {label: 'I use a cane', value: 'cane'},
                                    {label: 'I use a walker', value: 'walker'},
                                    {label: 'I use a wheelchair', value: 'wheelchair'},
                                    ]);
                                setUserType("senior");
                            }}
                            accessibilityLabel="I am a senior"
                            accessibilityRole="button"
                            accessibilityHint="Select this if you are a senior wanting to improve home safety"
                        >
                            <View style={modernStyles.iconCircle}>
                                <FontAwesome5 name="user" size={32} color={colors.accent.primary} />
                            </View>
                            <Text style={modernStyles.cardTitle}>I'm a Senior</Text>
                            <Text style={modernStyles.cardDescription}>
                                I want to make my home safer and more accessible
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                modernStyles.card,
                                pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={() => {
                                setItems([
                                    {label: 'The senior walks without an aid', value: 'none'},
                                    {label: 'The senior uses a cane', value: 'cane'},
                                    {label: 'The senior uses a walker', value: 'walker'},
                                    {label: 'The senior uses a wheelchair', value: 'wheelchair'},
                                    ]);
                                setUserType("caregiver");
                            }}
                            accessibilityLabel="I am a caregiver"
                            accessibilityRole="button"
                            accessibilityHint="Select this if you are a caregiver or relative"
                        >
                            <View style={modernStyles.iconCircle}>
                                <FontAwesome5 name="hands-helping" size={32} color={colors.accent.primary} />
                            </View>
                            <Text style={modernStyles.cardTitle}>I'm a Caregiver</Text>
                            <Text style={modernStyles.cardDescription}>
                                I'm helping a senior improve their home safety
                            </Text>
                        </Pressable>
                    </View>
                )}
                {userType != null && (
                    <View style={modernStyles.formContainer}>
                        {/* Age Input */}
                        <View style={modernStyles.fieldGroup}>
                            <Text style={[modernStyles.label, ageError && { color: colors.status.error }]}>
                                {userType == "caregiver" ? "Senior's " : ""}Age
                            </Text>
                            <TextInput
                                style={[
                                    modernStyles.input,
                                    ageFocused && { borderColor: colors.accent.primary, borderWidth: 2 },
                                    ageError && { borderColor: colors.status.error, borderWidth: 2 }
                                ]}
                                placeholder={userType == "caregiver" ? "Enter the senior's age" : "Enter your age"}
                                placeholderTextColor={colors.text.secondary + '80'}
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    setAge(text);
                                    if (text.trim() !== '') setAgeError(null);
                                }}
                                onFocus={() => setAgeFocused(true)}
                                onBlur={() => setAgeFocused(false)}
                                accessibilityLabel={userType == "caregiver" ? "Senior age input" : "Your age input"}
                            />
                            {!!ageError && (
                                <View style={errorMessage.container}>
                                    <Text style={errorMessage.text}>{ageError}</Text>
                                </View>
                            )}
                        </View>

                        {/* Mobility Dropdown */}
                        <View style={[modernStyles.fieldGroup, { zIndex: 5000 }]}>
                            <Text style={[modernStyles.label, mobilityError && { color: colors.status.error }]}>
                                {userType == "caregiver" ? "Senior's " : ""}Mobility
                            </Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={(callback) => {
                                    setValue(callback);
                                    if (callback) setMobilityError(null);
                                }}
                                setItems={setItems}
                                zIndex={5000}
                                placeholder="Select mobility aid"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: mobilityError ? colors.status.error : colors.border.secondary,
                                    borderWidth: 1,
                                    borderRadius: borderRadius.md,
                                    minHeight: verticalScale(52),
                                }}
                                textStyle={{
                                    color: colors.text.primary,
                                    fontSize: moderateScale(16),
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.secondary,
                                }}
                                listMode='SCROLLVIEW'
                                accessibilityLabel={userType == "caregiver" ? "Senior mobility selector" : "Your mobility selector"}
                            />
                            {!!mobilityError && (
                                <View style={errorMessage.container}>
                                    <Text style={errorMessage.text}>{mobilityError}</Text>
                                </View>
                            )}
                        </View>

                        {/* Accessibility Needs */}
                        <View style={modernStyles.fieldGroup}>
                            <Text style={modernStyles.sectionLabel}>Accessibility Needs</Text>

                            <Pressable
                                style={({ pressed }) => [
                                    modernStyles.checkboxCard,
                                    vision && modernStyles.checkboxCardActive,
                                    pressed && { opacity: 0.8 }
                                ]}
                                onPress={() => {setVision(!vision)}}
                                accessibilityLabel={userType == "caregiver" ? "Senior has trouble seeing" : "I have trouble seeing"}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: vision }}
                            >
                                <View style={modernStyles.checkboxContent}>
                                    <FontAwesome5
                                        name="eye"
                                        size={20}
                                        color={vision ? colors.accent.primary : colors.text.secondary}
                                    />
                                    <Text style={[modernStyles.checkboxText, vision && modernStyles.checkboxTextActive]}>
                                        {userType == "caregiver" ? "Has trouble seeing" : "I have trouble seeing"}
                                    </Text>
                                </View>
                                <Checkbox
                                    style={modernStyles.checkbox}
                                    value={vision}
                                    onValueChange={(newValue) => {setVision(newValue)}}
                                    color={vision ? colors.accent.primary : undefined}
                                />
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    modernStyles.checkboxCard,
                                    hearing && modernStyles.checkboxCardActive,
                                    pressed && { opacity: 0.8 }
                                ]}
                                onPress={() => {setHearing(!hearing)}}
                                accessibilityLabel={userType == "caregiver" ? "Senior has trouble hearing" : "I have trouble hearing"}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: hearing }}
                            >
                                <View style={modernStyles.checkboxContent}>
                                    <FontAwesome5
                                        name="assistive-listening-systems"
                                        size={20}
                                        color={hearing ? colors.accent.primary : colors.text.secondary}
                                    />
                                    <Text style={[modernStyles.checkboxText, hearing && modernStyles.checkboxTextActive]}>
                                        {userType == "caregiver" ? "Has trouble hearing" : "I have trouble hearing"}
                                    </Text>
                                </View>
                                <Checkbox
                                    style={modernStyles.checkbox}
                                    value={hearing}
                                    onValueChange={(newValue) => {setHearing(newValue)}}
                                    color={hearing ? colors.accent.primary : undefined}
                                />
                            </Pressable>
                        </View>

                        {/* Action Buttons */}
                        <View style={modernStyles.buttonsContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    modernStyles.primaryButton,
                                    pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                                ]}
                                onPress={() => {
                                    if (age == '' || age == null || age == undefined || age.trim() == '') {
                                        setAgeError("Please enter a valid age");
                                    }
                                    if (value == '' || value == null || value == undefined) {
                                        setMobilityError("Please select a mobility option");
                                    }
                                    if (age != '' && age != null && age != undefined && age.trim() != '' && value != '' && value != null && value != undefined) {
                                        setAgeError(null);
                                        setMobilityError(null);

                                        trackEvent("FirstLoad", { age: age, mobility: value, vision: vision, hearing: hearing, userType: userType });

                                        AsyncStorage.setItem('firstLoad', 'false');
                                        const personalInfo = {age: age , mobility: value, vision: vision, hearing: hearing, userType: userType};
                                        AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo));
                                        navigation.replace("Home")
                                    }
                                }}
                                accessibilityLabel="Continue"
                                accessibilityRole="button"
                                accessibilityHint="Submit your information and continue to home screen"
                            >
                                <Text style={modernStyles.primaryButtonText}>Continue to ElderSafe</Text>
                                <FontAwesome5 name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    modernStyles.secondaryButton,
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => {
                                    setUserType(null);
                                    setAge(0);
                                    setValue(null);
                                    setVision(false);
                                    setHearing(false);
                                    setAgeError(null);
                                    setMobilityError(null);
                                }}
                                accessibilityLabel="Back"
                                accessibilityRole="button"
                                accessibilityHint="Go back to user type selection"
                            >
                                <FontAwesome5 name="arrow-left" size={18} color={colors.text.primary} style={{ marginRight: 8 }} />
                                <Text style={modernStyles.secondaryButtonText}>Back</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </ScrollView>
            <StatusBar style="light" translucent={false} />
        </SafeAreaView>
    )
}

const modernStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    progressContainer: {
        paddingHorizontal: horizontalScale(30),
        paddingTop: verticalScale(20),
        marginBottom: verticalScale(20),
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.background.secondary,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: verticalScale(8),
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent.primary,
        borderRadius: 2,
    },
    stepText: {
        fontSize: moderateScale(12),
        color: colors.text.secondary,
        textAlign: 'right',
    },
    title: {
        fontSize: moderateScale(28),
        fontWeight: '700',
        color: colors.text.primary,
        paddingHorizontal: horizontalScale(30),
        marginBottom: verticalScale(8),
    },
    subtitle: {
        fontSize: moderateScale(15),
        color: colors.text.secondary,
        paddingHorizontal: horizontalScale(30),
        marginBottom: verticalScale(30),
        lineHeight: moderateScale(22),
    },
    cardsContainer: {
        paddingHorizontal: horizontalScale(30),
        gap: verticalScale(16),
    },
    card: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: horizontalScale(24),
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border.secondary,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconCircle: {
        width: horizontalScale(80),
        height: horizontalScale(80),
        borderRadius: horizontalScale(40),
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(16),
        borderWidth: 2,
        borderColor: colors.accent.primary + '20',
    },
    cardTitle: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: verticalScale(8),
    },
    cardDescription: {
        fontSize: moderateScale(14),
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: moderateScale(20),
    },
    formContainer: {
        paddingHorizontal: horizontalScale(30),
        gap: verticalScale(20),
    },
    fieldGroup: {
        marginBottom: verticalScale(8),
    },
    label: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: verticalScale(8),
    },
    sectionLabel: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: verticalScale(12),
    },
    input: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: borderRadius.md,
        paddingHorizontal: horizontalScale(16),
        paddingVertical: verticalScale(14),
        fontSize: moderateScale(16),
        color: colors.text.primary,
        minHeight: verticalScale(52),
    },
    checkboxCard: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: borderRadius.md,
        padding: horizontalScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(12),
    },
    checkboxCardActive: {
        borderColor: colors.accent.primary,
        backgroundColor: colors.accent.primary + '10',
    },
    checkboxContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: horizontalScale(12),
        flex: 1,
    },
    checkboxText: {
        fontSize: moderateScale(15),
        color: colors.text.primary,
        flex: 1,
    },
    checkboxTextActive: {
        color: colors.accent.primary,
        fontWeight: '500',
    },
    checkbox: {
        borderRadius: borderRadius.sm,
    },
    buttonsContainer: {
        paddingTop: verticalScale(20),
        gap: verticalScale(12),
        paddingBottom: verticalScale(20),
    },
    primaryButton: {
        backgroundColor: colors.accent.primary,
        borderRadius: borderRadius.md,
        paddingVertical: verticalScale(16),
        paddingHorizontal: horizontalScale(24),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.accent.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(17),
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: verticalScale(14),
        paddingHorizontal: horizontalScale(24),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: colors.text.primary,
        fontSize: moderateScale(16),
        fontWeight: '500',
    },
});