import { StyleSheet, Text, View, TouchableOpacity, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, StatusBar, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles'
import {wstyles} from '../styles/WelcomeStyles'
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
                    backgroundColor: '#1C1C1E',
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
            {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
            <ScrollView nestedScrollEnabled={true}
            
            >
                <Text style={styles.header}>Let's Get Started</Text>
                <Text style={styles.subheader}>Tell us a bit about {userType == "caregiver" ? "the senior you are taking care of." : "yourself." }</Text>
                {userType == null && (
                    <View style={wstyles.userOptions}>
                        <TouchableOpacity style={wstyles.optionButton} onPress={() => {
                            setItems([
                                {label: 'I walk without an aid', value: 'none'},
                                {label: 'I use a cane', value: 'cane'},
                                {label: 'I use a walker', value: 'walker'},
                                {label: 'I use a wheelchair', value: 'wheelchair'},
                                ]);
                            setUserType("senior");
                        }}>
                            <Text style={wstyles.optionText}>I am a senior who wants to improve the safety of my home.</Text>
                        </TouchableOpacity>
                        <View style={{borderWidth: 0.8, borderColor: "white", width: "100%" }}></View>
                        <TouchableOpacity style={wstyles.optionButton} onPress={() => {
                            setItems([
                                {label: 'The senior walks without an aid', value: 'none'},
                                {label: 'The senior uses a cane', value: 'cane'},
                                {label: 'The senior uses a walker', value: 'walker'},
                                {label: 'The senior uses a wheelchair', value: 'wheelchair'},
                                ]);
                            setUserType("caregiver");
                        }}>
                            <Text style={wstyles.optionText}>I am a caregiver or relative who wants to improve the safety of a senior's home.</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {userType != null && (
                    <>
                    <View style={wstyles.ageContainer}>
                        <Text style={wstyles.ageLabel}>{userType == "caregiver" ? "Senior " : ""}Age</Text>
                        <TextInput 
                        style={wstyles.ageInput} 
                        placeholder={userType == "caregiver" ? "Enter the senior's age" : "Enter your age"} 
                        placeholderTextColor={'white'}
                        keyboardType="numeric"
                        onChangeText={(text) => {setAge(text)}}
                        />
                        {!!ageError && (
                            <Text style={{ color: "red" }}>{ageError}</Text>
                        )}   
                    </View>
                    <View style={wstyles.mobilityContainer}>
                        <Text style={wstyles.ageLabel}>{userType == "caregiver" ? "Senior " : ""}Mobility</Text>
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
                        {!!mobilityError && (
                            <Text style={{ color: "red" }}>{mobilityError}</Text>
                        )}    
                    </View>
                    <View style={wstyles.visionContainer}>
                        <Text style={wstyles.ageLabel}>{userType == "caregiver" ? "Senior " : ""}Vision</Text>
                        <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row'}} onPress={() => {setVision(!vision)}}>
                            <Checkbox
                                style={wstyles.checkbox}
                                value={vision}
                                onValueChange={(newValue) => {setVision(newValue)}}
                            />
                            <Text style={wstyles.checkboxLabel}>{userType == "caregiver" ? "The senior has trouble seeing" : "I have trouble seeing"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={wstyles.hearingContainer}>
                        <Text style={wstyles.ageLabel}>{userType == "caregiver" ? "Senior " : ""}Hearing</Text>
                        <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row'}} onPress={() => {setHearing(!hearing)}}>
                            <Checkbox
                                style={wstyles.checkbox}
                                value={hearing}
                                onValueChange={(newValue) => {setHearing(newValue)}}
                            />
                            <Text style={wstyles.checkboxLabel}>{userType == "caregiver" ? "The senior has trouble hearing" : "I have trouble hearing"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={wstyles.submitContainer}>
                        <TouchableOpacity style={wstyles.submitButton} onPress={() => {
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
                        }}>
                            <Text style={wstyles.submitText}>Continue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[wstyles.submitButton, {marginTop: verticalScale(20)}]} onPress={() => {
                            setUserType(null);
                        }
                        }>
                            <Text style={wstyles.submitText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                )}
            </ScrollView>
            <StatusBar style="light" translucent={false} />
        </SafeAreaView>
    )
}