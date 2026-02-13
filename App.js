import React, { useState, useEffect } from 'react';
import { ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verticalScale, horizontalScale, moderateScale } from './styles/Styles';
import * as SplashScreen from 'expo-splash-screen';
import Aptabase, { trackEvent } from "@aptabase/react-native";

import {styles} from './styles/Styles'
import Rooms, {RoomSelect, RoomEditor, RoomAdded, RoomReport} from './pages/Rooms';  
import Tips from './pages/Tips';
import Home from './pages/Home';
import FirstLoad from './pages/FirstLoad';
import Settings from './pages/Settings';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Aptabase.init("A-US-5290383727");

function HomeScreens({navigation, route}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: '#1C1C1E'}, navigationBarColor: "#1C1C1E"}} >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FirstLoad" component={FirstLoad} options={{gestureEnabled: false}} />
    </Stack.Navigator>
  );
}

function RoomScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: '#1C1C1E'}, navigationBarColor: "#1C1C1E"}} >
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen name="RoomSelection" component={RoomSelect} />
      <Stack.Screen name="RoomEditor" component={RoomEditor} />
      <Stack.Screen name="RoomAdded" component={RoomAdded} options={{gestureEnabled: false}} />
      <Stack.Screen name="RoomReport" component={RoomReport} />
    </Stack.Navigator>
  );
}

function BottomNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        backgroundColor: '#1C1C1E',
        tabBarStyle: { backgroundColor: '#1C1C1E', borderTopWidth: 0, elevation: 0 },
      }}
    >
      <Tab.Screen
        name="HomeScreens"
        component={HomeScreens}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
          headerShown: false,        
        }}
      />
      <Tab.Screen
        name="RoomScreens"
        component={RoomScreens}
        options={{
          tabBarLabel: 'Rooms',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bed" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Tips"
        component={Tips}
        options={{
          tabBarLabel: 'Tips',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="lightbulb-o" color={color} size={size} />
          ),
          navigationBarColor: "#1C1C1E",
          headerShown: false
        }}
        initialParams = {{goTo: 0}}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="gear" color={color} size={size} />
          ),
          headerShown: false,
          navigationBarColor: "#1C1C1E",
        }}
      />
    </Tab.Navigator>
  );
}

const introStyles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: horizontalScale(20),
  },

  title: {
    fontSize: moderateScale(30),
    color: 'white',
    textAlign: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    fontWeight: 'bold',
  },

  text: {
    fontSize: moderateScale(20),
    color: 'white',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },

  image: {
    width: horizontalScale(300),
    height: verticalScale(300),
    marginBottom: verticalScale(20),
  },
});


const slides = [
  {
    key: 'one',
    title: 'Welcome to ElderSafe!',
    text: 'You are one step closer to making your home a safer place for you and your loved ones.',
    image: require('./assets/1.png'),
    backgroundColor: '#722890',
  },
  {
    key: 'two',
    title: 'Interactive Room Safety Assessments',
    text: 'ElderSafe provides interactive room safety assessments that help you identify hazards in your home.',
    image: require('./assets/2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'Personalized Safety Tips',
    text: 'ElderSafe provides personalized safety tips and product recommendations based on your room safety assessments.',
    image: require('./assets/3.png'),
    backgroundColor: '#22bcb5',
  }
];

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1C1C1E',
  },
}

SplashScreen.preventAutoHideAsync();

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showRealApp: false, //change
      loading: true,
    }
  }

  async componentDidMount() {
    try {
      AsyncStorage.getItem('firstLoad').then((value) => {
        if (value == null || value == undefined) {
          this.setState({ showRealApp: false, loading: false });
          trackEvent("AppLaunch", {
            firstLoad: "true",
            time: new Date().toString(),
          });
        } else {
          this.setState({ showRealApp: true, loading: false });
          trackEvent("AppLaunch", {
            firstLoad: "false",
            time: new Date().toString(),
          });
        }
      })
      .then(() => {
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 1500);
      });
    } catch (e) {
      console.log(e);
    }

  }

  _renderItem = ({ item }) => {
    return (
      <View style={[introStyles.slide, {backgroundColor: item.backgroundColor}]}>
        <Text style={introStyles.title}>{item.title}</Text>
        <Image source={item.image} style={introStyles.image} />
        <Text style={introStyles.text}>{item.text}</Text>
      </View>
    );
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    AsyncStorage.setItem('firstLoad', 'true').then(() => {
      this.setState({ showRealApp: true });
  });
  }

  render() {


    if (this.state.loading) return <ActivityIndicator size="large" />
    if (this.state.showRealApp) {

      StatusBar.setBarStyle('light-content', true);
 
      return (
        <NavigationContainer theme={theme}>
          <BottomNav />
        </NavigationContainer>
      );
    } else {
      return (
        <AppIntroSlider
          data={slides}
          renderItem={this._renderItem}
          onDone={this._onDone}
        />
      );
    }
  }
}