import { StyleSheet, Text, View, TouchableOpacity, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, Platform, StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles'
import {wstyles} from '../styles/WelcomeStyles'
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
            <View style={[styles.container, {"backgroundColor": "#1C1C1E", paddingTop: insets.top}]}>
                {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="dark-content" />}
                <ScrollView nestedScrollEnabled={true}>
                    <Text style={styles.header}>Settings</Text>
                    <Text style={styles.subheader}>Edit your preferences and personal information</Text>
                        <View style={wstyles.ageContainer}>
                            <Text style={wstyles.ageLabel}>Age</Text>
                            <TextInput 
                            style={wstyles.ageInput} 
                            placeholder="Enter your age" 
                            placeholderTextColor="white"
                            keyboardType="numeric"
                            onChangeText={(text) => {setAge(text)}}
                            value={age}
                            />
                            {!!ageError && (
                                <Text style={{ color: "red" }}>{ageError}</Text>
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
                                    backgroundColor: "#1C1C1E",
                                    borderColor: "white",
                                    color: "white",
                                }}
                                textStyle={{
                                    color: "white",
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: "#1C1C1E",
                                    borderColor: "white",
                                    color: "white",
                                }}
                                listMode='SCROLLVIEW'
                                
                            />
                        </View>
                        <View style={wstyles.visionContainer}>
                            <Text style={wstyles.ageLabel}>Vision</Text>
                            <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row'}} onPress={() => {setVision(!vision)}}>
                                <Checkbox
                                    style={wstyles.checkbox}
                                    value={vision}
                                    onValueChange={(newValue) => {setVision(newValue)}}
                                />
                                <Text style={wstyles.checkboxLabel}>I have trouble seeing</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={wstyles.hearingContainer}>
                            <Text style={wstyles.ageLabel}>Hearing</Text>
                            <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row'}} onPress={() => setHearing(!hearing)}>
                                <Checkbox
                                    style={wstyles.checkbox}
                                    value={hearing}
                                    onValueChange={(newValue) => {setHearing(newValue)}}
                                />
                                <Text style={wstyles.checkboxLabel}>I have trouble hearing</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={wstyles.submitContainer}>
                            <TouchableOpacity style={wstyles.submitButton} onPress={() => {
                                if (age == '' || age == null || age == undefined || age.trim() == '') {
                                    setAgeError("Please enter your age");
                                    return;
                                } else {
                                    setAgeError(null);
                                    const personalInfo = {age: age , mobility: value, vision: vision, hearing: hearing};
                                    AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo));
                                    Alert.alert("Personal Information Saved", "Your information has been updated.");
                                }
                            }}>
                                <Text style={wstyles.submitText}>Save</Text>
                            </TouchableOpacity>
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