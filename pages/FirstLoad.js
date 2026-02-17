import { StyleSheet, Text, View, Pressable, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, StatusBar, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles';
import {wstyles} from '../styles/WelcomeStyles';
import { colors } from '../styles/theme';
import { primaryButton, primaryButtonText, getButtonStyle, getButtonTextStyle } from '../styles/buttonStyles';
import formStyles, { getInputContainerStyle, errorMessage } from '../styles/formStyles';
import { ExpoStatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome } from '@expo/vector-icons';
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
                    display: 'block',
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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <ScrollView nestedScrollEnabled={true}
            
            >
                <Text style={styles.header}>Let's Get Started</Text>
                <Text style={styles.subheader}>Tell us a bit about {userType == "caregiver" ? "the senior you are taking care of." : "yourself." }</Text>
                {userType == null && (
                    <View style={wstyles.userOptions}>
                        <Pressable
                            style={({ pressed }) => [
                                wstyles.optionButton,
                                pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
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
                            <Text style={wstyles.optionText}>I am a senior who wants to improve the safety of my home.</Text>
                        </Pressable>
                        <View style={{borderWidth: 0.8, borderColor: colors.border.primary, width: "100%" }}></View>
                        <Pressable
                            style={({ pressed }) => [
                                wstyles.optionButton,
                                pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
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
                            <Text style={wstyles.optionText}>I am a caregiver or relative who wants to improve the safety of a senior's home.</Text>
                        </Pressable>
                    </View>
                )}
                {userType != null && (
                    <>
                    <View style={wstyles.ageContainer}>
                        <Text style={[wstyles.ageLabel, ageError && { color: colors.status.error }]}>
                            {userType == "caregiver" ? "Senior " : ""}Age
                        </Text>
                        <TextInput
                            style={[
                                wstyles.ageInput,
                                ageFocused && { borderColor: colors.border.focus, borderWidth: 2 },
                                ageError && { borderColor: colors.border.error, borderWidth: 2 }
                            ]}
                            placeholder={userType == "caregiver" ? "Enter the senior's age" : "Enter your age"}
                            placeholderTextColor={colors.text.secondary}
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
                    <View style={wstyles.mobilityContainer}>
                        <Text style={[wstyles.ageLabel, mobilityError && { color: colors.status.error }]}>
                            {userType == "caregiver" ? "Senior " : ""}Mobility
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
                            style={{
                                backgroundColor: colors.background.primary,
                                borderColor: mobilityError ? colors.border.error : colors.border.primary,
                                borderWidth: mobilityError ? 2 : 1,
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
                            accessibilityLabel={userType == "caregiver" ? "Senior mobility selector" : "Your mobility selector"}
                        />
                        {!!mobilityError && (
                            <View style={errorMessage.container}>
                                <Text style={errorMessage.text}>{mobilityError}</Text>
                            </View>
                        )}
                    </View>
                    <View style={wstyles.visionContainer}>
                        <Text style={wstyles.ageLabel}>{userType == "caregiver" ? "Senior " : ""}Vision</Text>
                        <Pressable
                            style={({ pressed }) => [
                                {alignItems: 'center', flexDirection: 'row'},
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => {setVision(!vision)}}
                            accessibilityLabel={userType == "caregiver" ? "Senior has trouble seeing" : "I have trouble seeing"}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: vision }}
                        >
                            <Checkbox
                                style={wstyles.checkbox}
                                value={vision}
                                onValueChange={(newValue) => {setVision(newValue)}}
                                color={vision ? colors.accent.primary : undefined}
                            />
                            <Text style={wstyles.checkboxLabel}>{userType == "caregiver" ? "The senior has trouble seeing" : "I have trouble seeing"}</Text>
                        </Pressable>
                    </View>
                    <View style={wstyles.hearingContainer}>
                        <Text style={wstyles.ageLabel}>{userType == "caregiver" ? "Senior " : ""}Hearing</Text>
                        <Pressable
                            style={({ pressed }) => [
                                {alignItems: 'center', flexDirection: 'row'},
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => {setHearing(!hearing)}}
                            accessibilityLabel={userType == "caregiver" ? "Senior has trouble hearing" : "I have trouble hearing"}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: hearing }}
                        >
                            <Checkbox
                                style={wstyles.checkbox}
                                value={hearing}
                                onValueChange={(newValue) => {setHearing(newValue)}}
                                color={hearing ? colors.accent.primary : undefined}
                            />
                            <Text style={wstyles.checkboxLabel}>{userType == "caregiver" ? "The senior has trouble hearing" : "I have trouble hearing"}</Text>
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
                                    navigation.navigate("Home")
                                }
                            }}
                            accessibilityLabel="Continue"
                            accessibilityRole="button"
                            accessibilityHint="Submit your information and continue to home screen"
                        >
                            <Text style={wstyles.submitText}>Continue</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                wstyles.submitButton,
                                {marginTop: verticalScale(20)},
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => {
                                setUserType(null);
                            }}
                            accessibilityLabel="Back"
                            accessibilityRole="button"
                            accessibilityHint="Go back to user type selection"
                        >
                            <Text style={wstyles.submitText}>Back</Text>
                        </Pressable>
                    </View>
                    </>
                )}
            </ScrollView>
            <StatusBar style="light" translucent={false} />
        </SafeAreaView>
    )
}