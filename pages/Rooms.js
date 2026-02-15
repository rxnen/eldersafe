import { StyleSheet, Text, View, Pressable, Button, Dimensions, FlatList, TextInput, Alert, ScrollView, StatusBar, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles';
import { colors } from '../styles/theme';
import { cardTouchable, primaryButton, iconButton } from '../styles/buttonStyles';
import formStyles, { getInputContainerStyle } from '../styles/formStyles';
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
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <Text style={{
                color: colors.text.primary, fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center', fontSize: moderateScale(25), marginBottom: verticalScale(20),
                }}>{roomName}</Text>
            <ScrollView>
                <Text style={styles.reportHeader}>Hazards in this room:</Text>
                <View style={styles.assessment}>

                    {recList.map((item) =>
                        <View key={item.uniqueId} style={styles.reportItem} >
                            <FontAwesome name="exclamation-triangle" size={40} color={colors.accent.primary} />
                            <Text style={styles.reportText}>{item.hazard}</Text>
                        </View>
                        )
                    }

                </View>
                <View styles={styles.reportButtons}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.reportOK,
                            pressed && { opacity: 0.7, borderColor: colors.accent.primary }
                        ]}
                        onPress={() => navigation.navigate("Rooms")}
                        accessibilityLabel="OK"
                        accessibilityRole="button"
                        accessibilityHint="Return to rooms list"
                    >
                        <Text style={styles.reportOKText}>OK</Text>
                    </Pressable>
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
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <View style={styles.roomAddedContainer}>
                <Text style={styles.roomAddedHeader}>Room Added!</Text>
                <FontAwesome name="check-circle" size={100} color={colors.accent.primary} />
                <Text style={styles.roomAddedText}>You can edit this room at any time</Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.roomAddedButton,
                        pressed && { opacity: 0.7, borderColor: colors.accent.primary }
                    ]}
                    onPress={() => navigation.navigate("Rooms")}
                    accessibilityLabel="OK"
                    accessibilityRole="button"
                    accessibilityHint="Return to rooms list"
                >
                    <Text style={styles.roomAddedButtonText}>OK</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.roomAddedButton,
                        pressed && { opacity: 0.7, borderColor: colors.accent.primary }
                    ]}
                    onPress={() => navigation.navigate("RoomSelection")}
                    accessibilityLabel="Add Another Room"
                    accessibilityRole="button"
                    accessibilityHint="Navigate to add another room"
                >
                    <Text style={styles.roomAddedButtonText}>Add Another Room</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.roomAddedButton,
                        pressed && { opacity: 0.7, borderColor: colors.accent.primary }
                    ]}
                    onPress={() => navigation.navigate("RoomReport", {roomType: roomType, roomName: roomName, answers: answers, primary: primary, id: id})}
                    accessibilityLabel="View Room Results"
                    accessibilityRole="button"
                    accessibilityHint="See hazards found in this room"
                >
                    <Text style={styles.roomAddedButtonText}>View Room Results</Text>
                </Pressable>
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
    const [nameFocused, setNameFocused] = useState(false);
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
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <View style= {styles.roomHeaderCont} >
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => navigation.navigate(previouslyAnswered != undefined && previouslyAnswered != null ? "Rooms" : "RoomSelection")}
                    accessibilityLabel="Back"
                    accessibilityRole="button"
                    accessibilityHint="Go back to previous screen"
                >
                    <FontAwesome name="arrow-left" size={30} color={colors.accent.primary} />
                </Pressable>
                <Text style={styles.roomHeaderText}>{roomType}</Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.saveButton,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => {saveRoomData()}}
                    accessibilityLabel="Save"
                    accessibilityRole="button"
                    accessibilityHint="Save room and assessment"
                >
                    <FontAwesome name="check" size={30} color={colors.accent.primary} />
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={{
                backgroundColor: colors.background.primary,
                alignItems: 'center',
                justifyContent: 'center',
            }}

            >
                <Text style={styles.inputHeader}>Pick a name for this room</Text>
                <View style={[
                    styles.inputContainer,
                    nameFocused && { borderColor: colors.border.focus, borderWidth: 2, borderBottomWidth: 0 },
                    nameError && { borderColor: colors.border.error, borderWidth: 2, borderBottomWidth: 0 }
                ]}>
                    <TextInput
                        style={styles.input}
                        placeholder={"My " + roomType}
                        placeholderTextColor={colors.text.secondary}
                        onChangeText={(text) => {
                            setRoomText(text);
                            if (text.trim() !== '') setNameError(null);
                        }}
                        value={roomText}
                        maxLength={25}
                        onFocus={() => setNameFocused(true)}
                        onBlur={() => setNameFocused(false)}
                        accessibilityLabel="Room name input"
                    />
                </View>
                {!!nameError && (
                    <View style={{marginTop: verticalScale(4), marginHorizontal: '10%', width: '80%'}}>
                        <Text style={{fontSize: moderateScale(15), color: colors.status.error}}>
                            {nameError}
                        </Text>
                    </View>
                )}
                <Text style={[styles.inputHeader, {marginTop: verticalScale(60)}]}>Now, check all that apply</Text>
               <View style={styles.assessment}>
                {roomType == "Bedroom" || roomType == "Bathroom" ?
               <Pressable
                    style={({ pressed }) => [
                        styles.assessmentItem,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => setPrimary(!isPrimary)}
                    accessibilityLabel={`This is my primary ${roomType.toLowerCase()}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isPrimary }}
               >
                    <Text style={styles.assessmentText}>This is my primary {roomType.toLowerCase()}.</Text>
                    <Checkbox
                        style={styles.assessmentCheckbox}
                        value={isPrimary}
                        onValueChange={() => {
                        setPrimary(!isPrimary);
                    }}
                        color={isPrimary ? colors.accent.primary : undefined}
                    />
                </Pressable>
                : null}
                    <FlatList
                        data={products}
                        scrollEnabled={false}
                        ListFooterComponent={
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: verticalScale(80)}} >
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.assessmentButton,
                                        pressed && { opacity: 0.7, borderColor: colors.accent.primary }
                                    ]}
                                    onPress={() => {saveRoomData()}}
                                    accessibilityLabel="Save"
                                    accessibilityRole="button"
                                    accessibilityHint="Save room assessment"
                                >
                                    <Text style={styles.assessmentButtonText}>Save</Text>
                                </Pressable>
                                {previouslyAnswered != undefined && previouslyAnswered != null ?
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.assessmentButton,
                                        {borderColor: colors.status.error},
                                        pressed && { opacity: 0.7 }
                                    ]}
                                    onPress={() => {deleteRoom(id)}}
                                    accessibilityLabel="Delete"
                                    accessibilityRole="button"
                                    accessibilityHint="Delete this room"
                                >
                                    <Text style={[styles.assessmentButtonText, {color: colors.status.error}]}>Delete</Text>
                                </Pressable> : null}
                            </View>
                        }
                        renderItem={({ item }) =>
                        <Pressable
                            style={({ pressed }) => [
                                styles.assessmentItem,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => handleChange(item.id)}
                            accessibilityLabel={item.txt}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: item.isChecked }}
                        >
                            <Text style={styles.assessmentText}>{item.txt}</Text>
                            <Checkbox
                                style={styles.assessmentCheckbox}
                                value={item.isChecked}
                                onValueChange={() => {
                                handleChange(item.id);
                            }}
                                color={item.isChecked ? colors.accent.primary : undefined}
                            />
                        </Pressable>
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
            {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
            <View style={styles.roomHeaderCont} >
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={() => navigation.navigate("Rooms")}
                    accessibilityLabel="Back"
                    accessibilityRole="button"
                    accessibilityHint="Return to rooms list"
                >
                    <FontAwesome name="arrow-left" size={30} color={colors.accent.primary} />
                </Pressable>
                <Text style={styles.roomHeaderText}>Add a Room</Text>
            </View>
            <FlatList
                ListHeaderComponent={
                    <Text style={[styles.inputHeader, {fontWeight: 'normal'}]}>Select a Room Type</Text>
                }
                style={{}}
                data={[{"roomType": "Bedroom", "roomIcon": "bed"}, {"roomType": "Bathroom", "roomIcon": "bath"}, {"roomType": "Living Room", "roomIcon": "tv"}, {"roomType": "Kitchen", "roomIcon": "cutlery"}, {"roomType": "Stairway", "roomIcon": "signal"}, {"roomType": "Home Exterior/Garage", "roomIcon": "car"}]}
                renderItem={({ item }) =>
                <Pressable
                    style={({ pressed }) => [
                        styles.room,
                        pressed && cardTouchable.pressed
                    ]}
                    onPress={() => {navigation.navigate("RoomEditor", {roomType: item.roomType, roomIcon: item.roomIcon}) }}
                    accessibilityLabel={`${item.roomType}`}
                    accessibilityRole="button"
                    accessibilityHint={`Add a ${item.roomType} to assess`}
                >
                    <FontAwesome name={item.roomIcon} size={40} color={colors.accent.primary} />
                    <Text style={styles.roomText}>{item.roomType}</Text>
                </Pressable>
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
                {Platform.OS === 'android' && <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />}
                <View style={styles.roomHeaderContainer}>
                    <Text style={styles.header}>My Rooms</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.plus,
                            pressed && { opacity: 0.7 }
                        ]}
                        onPress={() => navigation.navigate("RoomSelection")}
                        accessibilityLabel="Add room"
                        accessibilityRole="button"
                        accessibilityHint="Navigate to room selection"
                    >
                        <FontAwesome name="plus" size={35} color={colors.accent.primary} />
                    </Pressable>
                </View>

                <View style={styles.currentRooms}>
                    {rooms.length == 0 ?
                    <Pressable
                        onPress={() => navigation.navigate("RoomSelection")}
                        style={({ pressed }) => [
                            {
                                width: '100%',
                                height: verticalScale(100),
                                marginTop: 'auto',
                                marginBottom: 'auto',
                            },
                            pressed && { opacity: 0.7 }
                        ]}
                        accessibilityLabel="Add a room to get started"
                        accessibilityRole="button"
                        accessibilityHint="Navigate to room selection to add your first room"
                    >
                        <Text style={styles.noRooms}>
                            Add a room to get started!
                        </Text>
                    </Pressable> :
                    <FlatList
                        data={rooms}
                        ListFooterComponent={
                            rooms.length != 0 ? <Pressable
                            style={({ pressed }) => [
                                styles.roomFooter,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={() => navigation.navigate("Home")}
                            accessibilityLabel="View your home safety score"
                            accessibilityRole="button"
                            accessibilityHint="Navigate to home screen to see your score"
                        >
                                <Text style={styles.roomFooterText}>
                                    Done adding rooms? View your home safety score.
                                </Text>
                            </Pressable> : null
                        }
                        renderItem={({ item }) =>
                        <Pressable
                            style={({ pressed }) => [
                                styles.room,
                                {justifyContent: "space-between"},
                                pressed && cardTouchable.pressed
                            ]}
                            onPress={() => navigation.navigate("RoomEditor", {roomType: item['type'], roomIcon: item['icon'], previouslyAnswered: item['answers'], name: item['name'], primary: item['primary'], id: item['id']})}
                            onLongPress={() => deleteRoom(item['id'])}
                            accessibilityLabel={`${item['name']}`}
                            accessibilityRole="button"
                            accessibilityHint="Tap to edit, long press to delete"
                         >
                            <FontAwesome name={item['icon']} size={40} color={colors.accent.primary} />
                            <Text style={styles.roomText}>{item['name']}</Text>
                        </Pressable>
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