import { StyleSheet, Text, View, TouchableOpacity, FlatList, SectionList, Linking, useWindowDimensions, StatusBar, Platform, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {styles} from '../styles/Styles'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { verticalScale, horizontalScale, moderateScale } from '../styles/Styles';
import { FontAwesome } from '@expo/vector-icons'; 
import {products, hazardsDict, questions, important, roomQuestionNumbers, exclusions} from '../scripting/algorithm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {useRoute, useIsFocused, useNavigation} from '@react-navigation/native';

export class Hazards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hazards: [],
            roomList: [],
        }
    }

    render() {

        const markComplete = (roomID, id) => {
            Alert.alert(
                "Complete Hazard",
                "Are you sure you want to mark this hazard as complete?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Complete",
                        onPress: () => {
                            AsyncStorage.getItem('myRooms').then((value) => {
                                const roomList = JSON.parse(value);
                                const room = roomList.find(r => r.id == roomID);
                                room.answers.push(id);
                                room.answers.sort();
                                AsyncStorage.setItem('myRooms', JSON.stringify(roomList));
                            });                            
                        }
                    }
                ],
                { cancelable: false }
            );
        }

        AsyncStorage.multiGet(["myRooms", "personalInfo"]).then((items) => {
            const roomList = JSON.parse(items[0][1]);
            const personalInfo = JSON.parse(items[1][1]);
            if (roomList == null || roomList == undefined || roomList == [] || roomList == '[]' || roomList.length == 0) {
                this.setState({hazards:
                    []});
            } else {
                const allHazards = [
                    {importance: 'High Risk', data: []},
                    {importance: 'Medium Risk', data: []},
                    {importance: 'Low Risk', data: []},
                    {importance: 'No Risk', data: []}
                ];
                for (let i = 0; i < roomList.length; i++) {
                    const roomHazards = JSON.parse(JSON.stringify(hazardsDict[roomList[i].type]));
                    for (let k = 0; k < roomHazards.length; k++) {
                        if (!roomList[i].answers.includes(roomHazards[k].questionID)) {
                            let importance = 0;
                            if (exclusions.some(r => r.id == k && r.room == roomList[i].type)) {
                                const exclusion = exclusions.find(r => r.id == k);
                                if (personalInfo[exclusion.exclusion] == "true" || personalInfo[exclusion.exclusion] == true || personalInfo[exclusion.exclusion] == "walker" || personalInfo[exclusion.exclusion] == "cane" || personalInfo[exclusion.exclusion] == "wheelchair") {
                                    if ((personalInfo.mobility == 'cane' || personalInfo.mobility == 'walker' || personalInfo.mobility == 'wheelchair') && important['Mobility'].some(r => r.id == k && r.room == roomList[i].type)) {
                                        importance = 0;
                                    } else if (personalInfo.vision && important['Vision'].some(r => r.id == k && r.room == roomList[i].type)) {
                                        importance = 0;
                                    } else if (personalInfo.hearing && important['Hearing'].some(r => r.id == k && r.room == roomList[i].type)) {
                                        importance = 0;
                                    } else if (roomList[i].primary == true || roomList[i].primary == 'true') {
                                        importance = 1;
                                    } else {
                                        importance = 2;
                                    }
                                } else {
                                    importance = 3;
                                }
                            } else {
                                if ((personalInfo.mobility == 'cane' || personalInfo.mobility == 'walker' || personalInfo.mobility == 'wheelchair') && important['Mobility'].some(r => r.id == k && r.room == roomList[i].type)) {
                                    importance = 0;
                                } else if (personalInfo.vision && important['Vision'].some(r => r.id == k && r.room == roomList[i].type)) {
                                    importance = 0;
                                } else if (personalInfo.hearing && important['Hearing'].some(r => r.id == k && r.room == roomList[i].type)) {
                                    importance = 0;
                                } else if (roomList[i].primary == true || roomList[i].primary == 'true') {
                                    importance = 1;
                                } else {
                                    importance = 2;
                                }
                            }
                            allHazards[importance]['data'].push({room: roomList[i].type, hazard: roomHazards[k].hazard, icon: roomList[i].icon, questionID: roomHazards[k].questionID, roomID: roomList[i].id});
                        }
                    }
                }

                allHazards.splice(3, 1);
                
                if (allHazards[0].data.length == 0 && allHazards[1].data.length == 0 && allHazards[2].data.length == 0) {
                    this.setState({hazards:
                        []});
                } else {
                    const filteredHazards = allHazards.filter((section) => {
                        return section.data.length > 0;
                    });
                    this.setState({hazards: filteredHazards});
                }
            }
        });

        const {hazards} = this.state;

        return (
            <View style={styles.hazardContainer}>
                {hazards.length == 0 && <Text style={styles.noProductsText}>No hazards have been identified in your home!</Text>}
                <SectionList
                    sections={hazards}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.hazard} 
                        onLongPress={() => markComplete(item.roomID, item.questionID)}
                    >
                        <View style={styles.hazardLine}>
                            <View style={styles.hazardIconStyle} >
                                <FontAwesome name={item['icon']} size={25} color="white" style={styles.hazardIcon} />
                            </View>
                            <Text style={styles.hazardText}>{item['hazard']}</Text>
                        </View>
                    </TouchableOpacity>
                    )}
                    renderSectionHeader={({section: {importance}}) => <Text style={styles.tipSectionHeader}>{importance}</Text>}
                />
            </View>
        );
    }
};


const Products = () => {
    const [tipsList, setTipsList] = useState([]);

    AsyncStorage.multiGet(["myRooms", "personalInfo"]).then((items) => {
        const tips = [];
        const roomList = JSON.parse(items[0][1]);
        const personalInfo = JSON.parse(items[1][1]);
        if (roomList == null || roomList == undefined || roomList == [] || roomList == '[]') {
        } else {
                for (let i = 0; i < roomList.length; i++) {
                    const roomProducts = JSON.parse(JSON.stringify(products[roomList[i].type]));
                    const neededProducts = [];

                    for (let j = 0; j < roomQuestionNumbers[roomList[i].type].length; j++) {
                        if (!roomList[i].answers.includes(roomQuestionNumbers[roomList[i].type][j])) {
                            for (let k = 0; k < roomProducts.length; k++) {
                                if (roomProducts[k].hazardID == roomQuestionNumbers[roomList[i].type][j]) {
                                    if (exclusions.some(r => r.id == j && r.room == roomList[i].type)) {
                                        const exclusion = exclusions.find(r => r.id == j && r.room == roomList[i].type);
                                        if (personalInfo[exclusion.exclusion] == "true" || personalInfo[exclusion.exclusion] == true || personalInfo[exclusion.exclusion] == "walker" || personalInfo[exclusion.exclusion] == "cane" || personalInfo[exclusion.exclusion] == "wheelchair") {
                                            if ((personalInfo.mobility == 'cane' || personalInfo.mobility == 'walker' || personalInfo.mobility == 'wheelchair') && important['Mobility'].some(r => r.id == j && r.room == roomList[i].type)) {
                                                roomProducts[k].importance = 'high';
                                            } else if (personalInfo.vision && important['Vision'].some(r => r.id == j && r.room == roomList[i].type)) {
                                                roomProducts[k].importance = 'high';
                                            } else if (personalInfo.hearing && important['Hearing'].some(r => r.id == j && r.room == roomList[i].type)) {
                                                roomProducts[k].importance = 'high';
                                            } else if (roomList[i].primary == true || roomList[i].primary == 'true') {
                                                roomProducts[k].importance = 'medium';
                                            } else {
                                                roomProducts[k].importance = 'low';
                                            }
                                        }
                                    } else {
                                        if ((personalInfo.mobility == 'cane' || personalInfo.mobility == 'walker' || personalInfo.mobility == 'wheelchair') && important['Mobility'].some(r => r.id == j && r.room == roomList[i].type)) {
                                            roomProducts[k].importance = 'high';
                                        } else if (personalInfo.vision && important['Vision'].some(r => r.id == j && r.room == roomList[i].type)) {
                                            roomProducts[k].importance = 'high';
                                        } else if (personalInfo.hearing && important['Hearing'].some(r => r.id == j && r.room == roomList[i].type)) {
                                            roomProducts[k].importance = 'high';
                                        } else if (roomList[i].primary == true || roomList[i].primary == 'true') {
                                            roomProducts[k].importance = 'medium';
                                        } else {
                                            roomProducts[k].importance = 'low';
                                        }
                                    }
                                    neededProducts.push(roomProducts[k]);
                                }
                            }
                        }
                    }
                    if (neededProducts.length > 0) {
                        tips.push({
                            title: roomList[i].name,
                            data: neededProducts
                        });
                    }
                }
            }
            setTipsList(tips);
        });
    return (
        <View>
            {tipsList.length == 0 && <Text style={styles.noProductsText}>You currently have no product suggestions</Text>}
            <SectionList
                sections={tipsList}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity style={styles.tip} onPress={() => {Linking.openURL(item.link);}}>
                            <Image
                                style={styles.tipImage}
                                source={item.image}
                                />
                            <View style={styles.tipTextContainer}>
                                <Text style={styles.tipText}>{item.name}</Text>
                                <Text style={styles.tipDescription}>{item.description}</Text>
                                <Text style={{color: item.importance == "high" ? "red" : (item.importance == "medium" ? "orange" : "green")}}>{item.importance == "high" ? "Very Important" : (item.importance == "medium" ? "Important" : "Good to Have")}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                renderSectionHeader={({section}) => <Text style={styles.tipSectionHeader}>{section.title}</Text>}
                ListFooterComponent={tipsList.length > 0 && <Text style={styles.affiliateNote}>* Products may contain affiliate links</Text>}
                keyExtractor={(item, index) => index}
                style={styles.tipsList}
            />
        </View>
    );
};

const renderScene = SceneMap({
    hazards: Hazards,
    products: Products,
  });


export default function Tips() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const route = useRoute();
    const initialIndex = route.params?.goTo || 0;

    const [index, setIndex] = React.useState(initialIndex);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isFocused) {
          setIndex(initialIndex);
        }
      }, [isFocused, initialIndex]);

    const layout = useWindowDimensions();

    const [routes] = React.useState([
        { key: 'hazards', title: 'Hazards' },
        { key: 'products', title: 'Products' },
    ]);

    return (
        // <SafeAreaView style={{backgroundColor: '#1C1C1E', flex: 1,
        // flexDirection: 'column', }} edges={['top', 'left', 'right']}>
        <SafeAreaInsetsContext.Consumer>
        {insets => (
        <View style={{backgroundColor: '#1C1C1E', flex: 1, paddingTop: insets.top}}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#1C1C1E" barStyle="light-content" />}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={{backgroundColor: '#1C1C1E'}}
                
                renderTabBar={props => {
                    // Extract key and remaining props
                    const { key, ...tabBarProps } = props;
                    return (
                        <TabBar 
                            key={key}  // Pass key directly
                            {...tabBarProps}  // Spread remaining props
                            style={{
                                backgroundColor: '#1C1C1E',
                                color: 'white',
                            }}
                            indicatorStyle={{
                                backgroundColor: "#24a0ed",
                            }}
                        />
                    );
                }}
                
            />
            <ExpoStatusBar style="light" translucent={false} />
        </View>
        )}
        </SafeAreaInsetsContext.Consumer>
    );
}