import { StyleSheet, Text, View, Pressable, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, Platform, StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles';
import {wstyles} from '../styles/WelcomeStyles';
import { colors } from '../styles/theme';
import formStyles, { getInputContainerStyle, errorMessage } from '../styles/formStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar as ExpoStatusBar} from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect, BackHandler } from 'react';
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

        return (
            <View style={[styles.container, {"backgroundColor": colors.background.primary, paddingTop: insets.top}]}>
                {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
                <ScrollView nestedScrollEnabled={true}>
                    <Text style={styles.header}>Settings</Text>
                    <Text style={styles.subheader}>Edit your preferences and personal information</Text>
                        <View style={wstyles.ageContainer}>
                            <Text style={[wstyles.ageLabel, ageError && { color: colors.status.error }]}>Age</Text>
                            <TextInput
                                style={[
                                    wstyles.ageInput,
                                    ageFocused && { borderColor: colors.border.focus, borderWidth: 2 },
                                    ageError && { borderColor: colors.border.error, borderWidth: 2 }
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
                                <View style={errorMessage.container}>
                                    <Text style={errorMessage.text}>{ageError}</Text>
                                </View>
                            )}
                        </View>
                        <View style={wstyles.mobilityContainer}>
                            <Text style={wstyles.ageLabel}>Mobility</Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                zIndex={5000}
                                style={{
                                    backgroundColor: colors.background.primary,
                                    borderColor: colors.border.primary,
                                    color: colors.text.primary,
                                }}
                                textStyle={{
                                    color: colors.text.primary,
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: colors.background.primary,
                                    borderColor: colors.border.primary,
                                    color: colors.text.primary,
                                }}
                                listMode='SCROLLVIEW'
                                accessibilityLabel="Mobility selector"
                            />
                        </View>
                        <View style={wstyles.visionContainer}>
                            <Text style={wstyles.ageLabel}>Vision</Text>
                            <Pressable
                                style={({ pressed }) => [
                                    {alignItems: 'center', flexDirection: 'row'},
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => {setVision(!vision)}}
                                accessibilityLabel="I have trouble seeing"
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: vision }}
                            >
                                <Checkbox
                                    style={wstyles.checkbox}
                                    value={vision}
                                    onValueChange={(newValue) => {setVision(newValue)}}
                                    color={vision ? colors.accent.primary : undefined}
                                />
                                <Text style={wstyles.checkboxLabel}>I have trouble seeing</Text>
                            </Pressable>
                        </View>
                        <View style={wstyles.hearingContainer}>
                            <Text style={wstyles.ageLabel}>Hearing</Text>
                            <Pressable
                                style={({ pressed }) => [
                                    {alignItems: 'center', flexDirection: 'row'},
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => setHearing(!hearing)}
                                accessibilityLabel="I have trouble hearing"
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: hearing }}
                            >
                                <Checkbox
                                    style={wstyles.checkbox}
                                    value={hearing}
                                    onValueChange={(newValue) => {setHearing(newValue)}}
                                    color={hearing ? colors.accent.primary : undefined}
                                />
                                <Text style={wstyles.checkboxLabel}>I have trouble hearing</Text>
                            </Pressable>
                        </View>
                        <View style={wstyles.submitContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    wstyles.submitButton,
                                    pressed && { opacity: 0.7, borderColor: colors.accent.primary }
                                ]}
                                onPress={() => {
                                    if (age == '' || age == null || age == undefined || age.trim() == '') {
                                        setAgeError("Please enter your age");
                                        return;
                                    } else {
                                        setAgeError(null);
                                        const personalInfo = {age: age , mobility: value, vision: vision, hearing: hearing};
                                        AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo));
                                        Alert.alert("Personal Information Saved", "Your information has been updated.");
                                    }
                                }}
                                accessibilityLabel="Save"
                                accessibilityRole="button"
                                accessibilityHint="Save your personal information changes"
                            >
                                <Text style={wstyles.submitText}>Save</Text>
                            </Pressable>
                        </View>
                        {/* <View style={wstyles.submitContainer}>
                            <TouchableOpacity style={wstyles.submitButton} onPress={() => {
                                AsyncStorage.removeItem('personalInfo');
                                AsyncStorage.removeItem('myRooms');
                                AsyncStorage.removeItem('firstLoad');
                                console.log("Removed");
                            }}>
                                <Text style={wstyles.submitText}>Reset</Text>
                            </TouchableOpacity>
                        </View> */}
                </ScrollView>
                <ExpoStatusBar style="light" translucent={false} />
            </View>
        )
    }