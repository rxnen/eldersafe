import { StyleSheet, Text, View, TouchableOpacity, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, StatusBar, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons'; 
import React, { useState } from 'react';
import { verticalScale, horizontalScale, moderateScale } from '../styles/Styles';
import {fetchRooms, addRoom, deleteRoomData} from '../scripting/rooms';
import Checkbox from 'expo-checkbox';
import {questions, hazardsDict} from '../scripting/algorithm';
import { trackEvent } from "@aptabase/react-native";

export function RoomReport({route, navigation}) {
    const {roomType} = route.params;
    const {roomName} = route.params;
    const {answers} = route.params;
    const {id} = route.params;

    const insets = useSafeAreaInsets();

    const recList = JSON.parse(JSON.stringify(hazardsDict[roomType]));

    for (let i = 0; i < answers.length; i++) {
        recList.splice(answers[i], 1);
    }

    for (let i = 0; i < recList.length; i++) {
        recList[i].uniqueId = i;
    }

    return (
        // <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
            <Text style={{
                color: 'white', fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center', fontSize: moderateScale(25), marginBottom: verticalScale(20),
                }}>{roomName}</Text>
            <ScrollView>
                <Text style={styles.reportHeader}>Hazards in this room:</Text>
                <View style={styles.assessment}>

                    {recList.map((item) =>
                        <View key={item.uniqueId} style={styles.reportItem} >
                            <FontAwesome name="exclamation-triangle" size={40} color="#24a0ed" />
                            <Text style={styles.reportText}>{item.hazard}</Text>
                        </View>
                        )
                    }   

                </View>
                <View styles={styles.reportButtons}>
                    <TouchableOpacity style={styles.reportOK} onPress={() => navigation.navigate("Rooms")}>
                        <Text style={styles.reportOKText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ExpoStatusBar style="light" translucent={false} />
        </View>
    );
}


export function RoomAdded({route, navigation}) {
    const {roomType} = route.params;
    const {roomName} = route.params;
    const {answers} = route.params;
    const {primary} = route.params;
    const {id} = route.params;

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
            <View style={styles.roomAddedContainer}>
                <Text style={styles.roomAddedHeader}>Room Added!</Text>
                <FontAwesome name="check-circle" size={100} color="#24a0ed" />
                <Text style={styles.roomAddedText}>You can edit this room at any time</Text>
                <TouchableOpacity style={styles.roomAddedButton} onPress={() => navigation.navigate("Rooms")}>
                    <Text style={styles.roomAddedButtonText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roomAddedButton} onPress={() => navigation.navigate("RoomSelection")}>
                    <Text style={styles.roomAddedButtonText}>Add Another Room</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roomAddedButton} onPress={() => navigation.navigate("RoomReport", {roomType: roomType, roomName: roomName, answers: answers, primary: primary, id: id})}>
                    <Text style={styles.roomAddedButtonText}>View Room Results</Text>
                </TouchableOpacity>
            </View>
            <ExpoStatusBar style="light" translucent={false} />
        </View>
    );
}

export function RoomEditor({route, navigation}) {
    const {roomType} = route.params;
    const{previouslyAnswered} = route.params;
    const {name} = route.params;
    const {id} = route.params;
    const {primary} = route.params;
    const [roomText, setRoomText] = useState(name != undefined ? name : "");
    const [nameError, setNameError] = useState(null);
    const [isPrimary, setPrimary] = useState(primary != undefined ? primary : false);

    const insets = useSafeAreaInsets();

    // Setting the correct questions based on the room
    const data = [];

    for (let i = 0; i < questions[roomType].length; i++) {
        if (previouslyAnswered != null && previouslyAnswered != undefined) {
            if (previouslyAnswered.includes(i)) {
                data.push({
                    id: i,
                    txt: questions[roomType][i].question,
                    isChecked: true,
                });
            } else {
                data.push({
                    id: i,
                    txt: questions[roomType][i].question,
                    isChecked: false,
                });
            }
        } else {
            data.push({
                id: i,
                txt: questions[roomType][i].question,
                isChecked: false,
            });
        }
    }

    // Setting the state of the checkboxes

    const [products, setProducts] = useState(data);

    const handleChange = (id) => {
        let temp = products.map((product) => {
        if (id === product.id) {
            return { ...product, isChecked: !product.isChecked };
        }
        return product;
        });
        setProducts(temp);
    };

    let selected = products.filter((product) => product.isChecked);

    // Function to save the room data

    const saveRoomData = () => {
        let fullRoomText;
        if (roomText == undefined || roomText == null || roomText == "" || roomText.trim() == "") {
            fullRoomText = "My " + roomType;
        } else {
            fullRoomText = roomText;
        }
            setNameError(null);
            let answers = [];
            for (let i = 0; i < selected.length; i++) {
                if (selected[i].isChecked) {
                    answers.push(selected[i].id);
                } 
            }
            if (previouslyAnswered == undefined || previouslyAnswered == null) {
                trackEvent("RoomAdd", { 
                    roomType: roomType,
                    roomName: fullRoomText,
                    answers: answers.toString(),
                    primary: isPrimary,
                    id: id,
                });
            }
            addRoom(roomType, fullRoomText, answers, isPrimary, id);
            previouslyAnswered != undefined ? navigation.navigate("Rooms") : navigation.navigate("RoomAdded", {roomType: roomType, roomName: fullRoomText, answers: answers, primary: isPrimary, id: id});
    }

    const deleteRoom = (roomID) => {
        // prompt user to confirm deletion
        Alert.alert(
            "Delete Room",
            "Are you sure you want to delete this room?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        deleteRoomData(roomID);
                        navigation.navigate("Rooms");
                    }
                }
            ],
            { cancelable: false }
        );
    }
    

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
            <View style= {styles.roomHeaderCont} >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate(previouslyAnswered != undefined && previouslyAnswered != null ? "Rooms" : "RoomSelection")}>
                        <FontAwesome name="arrow-left" size={30} color="#24a0ed" />
                </TouchableOpacity>
                <Text style={styles.roomHeaderText}>{roomType}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={() => {saveRoomData()}}>
                    <FontAwesome name="check" size={30} color="#24a0ed" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{
                backgroundColor: '#1C1C1E',
                alignItems: 'center',
                justifyContent: 'center',
            }}

            >
                <Text style={styles.inputHeader}>Pick a name for this room</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                    style={styles.input} 
                    placeholder={"My " + roomType}
                    placeholderTextColor={"white"}
                    onChangeText={(text) => setRoomText(text)}
                    value={roomText}
                    maxLength={25}
                     />
                </View>
                {!!nameError && (
                    <Text style={{ color: "red", marginLeft: '10%' }}>{nameError}</Text>
                )}
                <Text style={[styles.inputHeader, {marginTop: verticalScale(60)}]}>Now, check all that apply</Text>
               <View style={styles.assessment}>
                {roomType == "Bedroom" || roomType == "Bathroom" ? 
               <TouchableOpacity style={styles.assessmentItem} onPress={() => setPrimary(!isPrimary)} >
                    <Text style={styles.assessmentText}>This is my primary {roomType.toLowerCase()}.</Text>
                    <Checkbox
                        style={styles.assessmentCheckbox}
                        value={isPrimary}
                        onValueChange={() => {
                        setPrimary(!isPrimary);
                    }}
                    />
                </TouchableOpacity>
                : null}
                    <FlatList
                        data={products}
                        scrollEnabled={false}
                        ListFooterComponent={
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: verticalScale(80)}} >
                                <TouchableOpacity style={styles.assessmentButton} onPress={() => {saveRoomData()}}>
                                    <Text style={styles.assessmentButtonText}>Save</Text>
                                </TouchableOpacity>
                                {previouslyAnswered != undefined && previouslyAnswered != null ?
                                <TouchableOpacity style={[styles.assessmentButton, {borderColor: 'red'}]} onPress={() => {deleteRoom(id)}}>
                                    <Text style={[styles.assessmentButtonText, {color: 'red'}]}>Delete</Text>
                                </TouchableOpacity> : null}
                            </View>
                        }
                        renderItem={({ item }) => 
                        <TouchableOpacity style={styles.assessmentItem} onPress={() => handleChange(item.id)} >
                            <Text style={styles.assessmentText}>{item.txt}</Text>
                            <Checkbox
                                style={styles.assessmentCheckbox}
                                value={item.isChecked}
                                onValueChange={() => {
                                handleChange(item.id);
                            }}
                            />
                        </TouchableOpacity>
                        }
                    />
               </View>
            </ScrollView>
            <ExpoStatusBar style="light" translucent={false} />
        </View>
    );
};


export function RoomSelect({navigation}) {

    const insets = useSafeAreaInsets();

    return (

        // <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
            <View style={styles.roomHeaderCont} >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Rooms")}>
                        <FontAwesome name="arrow-left" size={30} color="#24a0ed" />
                </TouchableOpacity>
                <Text style={styles.roomHeaderText}>Add a Room</Text>
            </View>
            <FlatList
                ListHeaderComponent={
                    <Text style={[styles.inputHeader, {fontWeight: 'normal'}]}>Select a Room Type</Text>
                }
                style={{}}
                data={[{"roomType": "Bedroom", "roomIcon": "bed"}, {"roomType": "Bathroom", "roomIcon": "bath"}, {"roomType": "Living Room", "roomIcon": "tv"}, {"roomType": "Kitchen", "roomIcon": "cutlery"}, {"roomType": "Stairway", "roomIcon": "signal"}, {"roomType": "Home Exterior/Garage", "roomIcon": "car"}]}
                renderItem={({ item }) =>
                <TouchableOpacity style={styles.room} onPress={() => {navigation.navigate("RoomEditor", {roomType: item.roomType, roomIcon: item.roomIcon}) }} >
                    <FontAwesome name={item.roomIcon} size={40} color="#24a0ed" />
                    <Text style={styles.roomText}>{item.roomType}</Text>
                </TouchableOpacity>
                }
            />
            <ExpoStatusBar style="light" translucent={false} />
        </View>
                

    );
}


export default class Rooms extends React.Component {

    constructor(props){
        super(props);
         this.state = {
            rooms: [],
        };
    }

    componentDidMount() {
        this.loadRooms();

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.loadRooms();
        });
    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }

    loadRooms = () => {
        fetchRooms().then((rooms) => {
            this.setState({
                rooms: rooms ? JSON.parse(rooms) : []
            });
        });
    };
    
    render() {

        const { navigation } = this.props;
        const { rooms } = this.state;

        // fetchRooms().then((rooms) => {
        //     if (rooms == null || rooms == undefined) {
        //         rooms = [];
        //         this.setState({rooms: []});
        //     } else {
        //         rooms = JSON.parse(rooms);
        //         this.setState({rooms: rooms});
        //     }
        // });

        const deleteRoom = (id) => {
            // prompt user to confirm deletion
            Alert.alert(
                "Delete Room",
                "Are you sure you want to delete this room?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Delete",
                        onPress: () => {
                            deleteRoomData(id);
                            fetchRooms().then((rooms) => {
                                if (rooms == null) {
                                    rooms = [];
                                    this.setState({rooms: []});
                                } else {
                                    rooms = JSON.parse(rooms);
                                    this.setState({rooms: rooms});
                                }
                            });
                        }
                    }
                ],
                { cancelable: false }
            );
        }

        return ( 
            <SafeAreaInsetsContext.Consumer>
            {insets => (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
                <View style={styles.roomHeaderContainer}>
                    <Text style={styles.header}>My Rooms</Text>
                    <TouchableOpacity style={styles.plus} onPress={() => navigation.navigate("RoomSelection")}>
                        <FontAwesome name="plus" size={35} color="#24a0ed" />
                    </TouchableOpacity>
                </View>

                <View style={styles.currentRooms}>
                    {rooms.length == 0 ? 
                    <TouchableOpacity onPress={() => navigation.navigate("RoomSelection")} 
                        style={{
                            width: '100%',
                            height: verticalScale(100),
                            marginTop: 'auto',
                            marginBottom: 'auto',                            
                        }}
                    >
                        <Text style={styles.noRooms}>
                            Add a room to get started!
                        </Text>
                    </TouchableOpacity> :
                    <FlatList
                        data={rooms}
                        ListFooterComponent={
                            rooms.length != 0 ? <TouchableOpacity style={styles.roomFooter} 
                            onPress={() => navigation.navigate("Home")} >
                                <Text style={styles.roomFooterText}>
                                    Done adding rooms? View your home safety score.
                                </Text>
                            </TouchableOpacity> : null
                        }
                        renderItem={({ item }) => 
                        <TouchableOpacity style={[styles.room, {justifyContent: "space-between"}]} 
                            onPress={() => navigation.navigate("RoomEditor", {roomType: item['type'], roomIcon: item['icon'], previouslyAnswered: item['answers'], name: item['name'], primary: item['primary'], id: item['id']})}
                            onLongPress={() => deleteRoom(item['id'])}
                         >
                            <FontAwesome name={item['icon']} size={40} color="#24a0ed" />
                            <Text style={styles.roomText}>{item['name']}</Text>
                        </TouchableOpacity>
                        }
                    />
                    }
                </View>
                <ExpoStatusBar style="light" translucent={false} />
            </View>
            )}
            </SafeAreaInsetsContext.Consumer>
        );
    }
}