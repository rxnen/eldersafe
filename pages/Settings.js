import { StyleSheet, Text, View, Pressable, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, Platform, StatusBar, Animated} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles';
import {wstyles} from '../styles/WelcomeStyles';
import { colors, shadows, borderRadius } from '../styles/theme';
import formStyles, { getInputContainerStyle, errorMessage } from '../styles/formStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar as ExpoStatusBar} from 'expo-status-bar';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect, BackHandler, useRef } from 'react';
import { verticalScale, horizontalScale, moderateScale } from '../styles/Styles';
import {fetchRooms, addRoom, deleteRoomData} from '../scripting/rooms';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings({navigation}) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'I walk without an aid', value: 'none'},
        {label: 'I use a cane', value: 'cane'},
        {label: 'I use a walker', value: 'walker'},
        {label: 'I use a wheelchair', value: 'wheelchair'},
    ]);
    const [age, setAge] = useState('');
    const [vision, setVision] = useState(false);
    const [hearing, setHearing] = useState(false);

    const [ageError, setAgeError] = useState(null);
    const [ageFocused, setAgeFocused] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const successOpacity = useRef(new Animated.Value(0)).current;

    const insets = useSafeAreaInsets();

    const setValues = async () => {
        try {
            const value = await AsyncStorage.getItem('personalInfo');
            if (value != null && value != undefined) {
                const personalInfo = JSON.parse(value);
                const stringAge = personalInfo['age'];
                setAge(stringAge);
                setValue(personalInfo.mobility);
                setVision(personalInfo.vision);
                setHearing(personalInfo.hearing);
            }
        } catch (error) {
            console.log(error);
        } 
    }


    useEffect(() => {
        setValues();
    }, []);

    const showSuccessMessage = () => {
        setSaveSuccess(true);
        Animated.sequence([
            Animated.timing(successOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(successOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setSaveSuccess(false));
    };

    const handleSave = () => {
        if (age == '' || age == null || age == undefined || age.trim() == '') {
            setAgeError("Please enter your age");
            return;
        }

        setAgeError(null);
        const personalInfo = {age: age, mobility: value, vision: vision, hearing: hearing};
        AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo));
        showSuccessMessage();
    };

        return (
            <View style={[styles.container, {backgroundColor: colors.background.primary, paddingTop: insets.top}]}>
                {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}

                {/* Success Message */}
                {saveSuccess && (
                    <Animated.View style={[
                        settingsStyles.successBanner,
                        {
                            opacity: successOpacity,
                            top: insets.top + verticalScale(10)
                        }
                    ]}>
                        <MaterialIcons name="check-circle" size={20} color={colors.status.success} />
                        <Text style={settingsStyles.successText}>Settings saved successfully!</Text>
                    </Animated.View>
                )}

                <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={settingsStyles.scrollContent}
                >
                    <View style={settingsStyles.headerContainer}>
                        <Text style={settingsStyles.headerTitle}>Settings</Text>
                        <Text style={settingsStyles.headerSubtitle}>Manage your personal information and preferences</Text>
                    </View>

                    {/* Personal Information Card */}
                    <View style={[settingsStyles.section, { zIndex: 10 }]}>
                        <View style={settingsStyles.sectionHeader}>
                            <View style={settingsStyles.sectionIconContainer}>
                                <FontAwesome5 name="user" size={18} color={colors.accent.primary} />
                            </View>
                            <Text style={settingsStyles.sectionTitle}>Personal Information</Text>
                        </View>

                        <View style={settingsStyles.card}>
                            {/* Age Field */}
                            <View style={settingsStyles.fieldContainer}>
                                <Text style={[settingsStyles.fieldLabel, ageError && { color: colors.status.error }]}>
                                    Age
                                </Text>
                                <TextInput
                                    style={[
                                        settingsStyles.textInput,
                                        ageFocused && settingsStyles.textInputFocused,
                                        ageError && settingsStyles.textInputError
                                    ]}
                                    placeholder="Enter your age"
                                    placeholderTextColor={colors.text.secondary}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        setAge(text);
                                        if (text.trim() !== '') setAgeError(null);
                                    }}
                                    value={age}
                                    onFocus={() => setAgeFocused(true)}
                                    onBlur={() => setAgeFocused(false)}
                                    accessibilityLabel="Age input"
                                />
                                {!!ageError && (
                                    <View style={settingsStyles.errorContainer}>
                                        <MaterialIcons name="error-outline" size={14} color={colors.status.error} />
                                        <Text style={settingsStyles.errorText}>{ageError}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Mobility Field */}
                            <View style={[settingsStyles.fieldContainer, { zIndex: 5000 }]}>
                                <Text style={settingsStyles.fieldLabel}>Mobility</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    zIndex={5000}
                                    zIndexInverse={1000}
                                    placeholder="Select mobility aid"
                                    placeholderStyle={{
                                        color: colors.text.secondary,
                                    }}
                                    style={settingsStyles.dropdown}
                                    textStyle={settingsStyles.dropdownText}
                                    dropDownContainerStyle={settingsStyles.dropdownContainer}
                                    listMode='SCROLLVIEW'
                                    accessibilityLabel="Mobility selector"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Accessibility Card */}
                    <View style={settingsStyles.section}>
                        <View style={settingsStyles.sectionHeader}>
                            <View style={settingsStyles.sectionIconContainer}>
                                <MaterialIcons name="accessibility" size={20} color={colors.accent.primary} />
                            </View>
                            <Text style={settingsStyles.sectionTitle}>Accessibility Needs</Text>
                        </View>

                        <View style={settingsStyles.card}>
                            {/* Vision Toggle */}
                            <Pressable
                                style={({ pressed }) => [
                                    settingsStyles.toggleRow,
                                    pressed && { opacity: 0.7, backgroundColor: colors.background.primary }
                                ]}
                                onPress={() => setVision(!vision)}
                                accessibilityLabel="Vision impairment toggle"
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: vision }}
                            >
                                <View style={settingsStyles.toggleLeft}>
                                    <View style={[settingsStyles.toggleIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.15)' }]}>
                                        <MaterialIcons name="visibility" size={20} color="#FF9800" />
                                    </View>
                                    <View style={settingsStyles.toggleTextContainer}>
                                        <Text style={settingsStyles.toggleLabel}>Vision</Text>
                                        <Text style={settingsStyles.toggleDescription}>I have trouble seeing</Text>
                                    </View>
                                </View>
                                <Checkbox
                                    style={settingsStyles.checkbox}
                                    value={vision}
                                    onValueChange={setVision}
                                    color={vision ? colors.accent.primary : colors.border.primary}
                                />
                            </Pressable>

                            <View style={settingsStyles.divider} />

                            {/* Hearing Toggle */}
                            <Pressable
                                style={({ pressed }) => [
                                    settingsStyles.toggleRow,
                                    pressed && { opacity: 0.7, backgroundColor: colors.background.primary }
                                ]}
                                onPress={() => setHearing(!hearing)}
                                accessibilityLabel="Hearing impairment toggle"
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: hearing }}
                            >
                                <View style={settingsStyles.toggleLeft}>
                                    <View style={[settingsStyles.toggleIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                                        <MaterialIcons name="hearing" size={20} color="#4CAF50" />
                                    </View>
                                    <View style={settingsStyles.toggleTextContainer}>
                                        <Text style={settingsStyles.toggleLabel}>Hearing</Text>
                                        <Text style={settingsStyles.toggleDescription}>I have trouble hearing</Text>
                                    </View>
                                </View>
                                <Checkbox
                                    style={settingsStyles.checkbox}
                                    value={hearing}
                                    onValueChange={setHearing}
                                    color={hearing ? colors.accent.primary : colors.border.primary}
                                />
                            </Pressable>
                        </View>
                    </View>

                    {/* Save Button */}
                    <View style={settingsStyles.saveButtonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                settingsStyles.saveButton,
                                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={handleSave}
                            accessibilityLabel="Save settings"
                            accessibilityRole="button"
                            accessibilityHint="Save your personal information changes"
                        >
                            <MaterialIcons name="save" size={20} color={colors.text.primary} />
                            <Text style={settingsStyles.saveButtonText}>Save Changes</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: verticalScale(40) }} />
                </ScrollView>
                <ExpoStatusBar style="light" translucent={false} />
            </View>
        )
    }

const settingsStyles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: horizontalScale(20),
    },

    headerContainer: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
    },

    headerTitle: {
        fontSize: moderateScale(32),
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: verticalScale(8),
    },

    headerSubtitle: {
        fontSize: moderateScale(16),
        color: colors.text.secondary,
        lineHeight: 22,
    },

    section: {
        marginBottom: verticalScale(24),
        zIndex: 1,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },

    sectionIconContainer: {
        width: horizontalScale(32),
        height: verticalScale(32),
        borderRadius: moderateScale(8),
        backgroundColor: 'rgba(36, 160, 237, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: horizontalScale(12),
    },

    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: colors.text.primary,
    },

    card: {
        backgroundColor: colors.background.secondary,
        borderRadius: moderateScale(borderRadius.lg),
        padding: horizontalScale(20),
        ...shadows.md,
        overflow: 'visible',
    },

    fieldContainer: {
        marginBottom: verticalScale(20),
    },

    fieldLabel: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: verticalScale(8),
    },

    textInput: {
        backgroundColor: colors.background.primary,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: moderateScale(borderRadius.md),
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(16),
        fontSize: moderateScale(16),
        color: colors.text.primary,
    },

    textInputFocused: {
        borderColor: colors.accent.primary,
        borderWidth: 2,
    },

    textInputError: {
        borderColor: colors.status.error,
        borderWidth: 2,
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(6),
    },

    errorText: {
        fontSize: moderateScale(12),
        color: colors.status.error,
        marginLeft: horizontalScale(4),
    },

    dropdown: {
        backgroundColor: colors.background.primary,
        borderColor: colors.border.secondary,
        borderRadius: moderateScale(borderRadius.md),
        minHeight: verticalScale(48),
    },

    dropdownText: {
        color: colors.text.primary,
        fontSize: moderateScale(16),
    },

    dropdownContainer: {
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.secondary,
        zIndex: 5000,
        elevation: 5000,
    },

    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(4),
        borderRadius: moderateScale(borderRadius.sm),
    },

    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    toggleIconContainer: {
        width: horizontalScale(40),
        height: verticalScale(40),
        borderRadius: moderateScale(borderRadius.md),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: horizontalScale(12),
    },

    toggleTextContainer: {
        flex: 1,
    },

    toggleLabel: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: verticalScale(2),
    },

    toggleDescription: {
        fontSize: moderateScale(13),
        color: colors.text.secondary,
    },

    checkbox: {
        width: horizontalScale(24),
        height: verticalScale(24),
        borderRadius: moderateScale(4),
    },

    divider: {
        height: 1,
        backgroundColor: colors.border.secondary,
        marginVertical: verticalScale(8),
    },

    saveButtonContainer: {
        marginTop: verticalScale(20),
    },

    saveButton: {
        backgroundColor: colors.accent.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(16),
        borderRadius: moderateScale(borderRadius.lg),
        ...shadows.md,
    },

    saveButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.text.primary,
        marginLeft: horizontalScale(8),
    },

    successBanner: {
        position: 'absolute',
        left: horizontalScale(20),
        right: horizontalScale(20),
        backgroundColor: colors.status.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(16),
        borderRadius: moderateScale(borderRadius.md),
        zIndex: 1000,
        ...shadows.lg,
    },

    successText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.text.primary,
        marginLeft: horizontalScale(8),
    },
});