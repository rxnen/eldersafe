import React, { useState, useEffect } from 'react';
import { ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verticalScale, horizontalScale, moderateScale } from './styles/Styles';
import { colors, typography } from './styles/theme';
import * as SplashScreen from 'expo-splash-screen';
import Aptabase, { trackEvent } from "@aptabase/react-native";

import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import {styles} from './styles/Styles';
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
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: colors.background.primary}, navigationBarColor: colors.background.primary}} >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FirstLoad" component={FirstLoad} options={{gestureEnabled: false}} />
    </Stack.Navigator>
  );
}

function RoomScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: colors.background.primary}, navigationBarColor: colors.background.primary}} >
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
        tabBarActiveTintColor: colors.text.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
        backgroundColor: colors.background.primary,
        tabBarStyle: { backgroundColor: colors.background.primary, borderTopWidth: 0, elevation: 0 }
      }}
      sceneContainerStyle={{ backgroundColor: colors.background.primary }}
      navigationBarColor={colors.background.primary}

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
          navigationBarColor: colors.background.primary,
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
          navigationBarColor: colors.background.primary,
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
    backgroundColor: colors.background.primary,
    paddingHorizontal: horizontalScale(20),
  },

  title: {
    fontSize: moderateScale(30),
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    fontWeight: typography.h1.fontWeight,
  },

  text: {
    fontSize: moderateScale(typography.body.fontSize),
    color: colors.text.primary,
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
    background: colors.background.primary,
    card: colors.background.secondary,
    text: colors.text.primary,
    border: colors.border.secondary,
    notification: colors.accent.primary,
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
      // StatusBar.setBarStyle('light-content', true);

      const value = await AsyncStorage.getItem('firstLoad');
      const isFirstLoad = value == null || value == undefined;

      // Track the event
      trackEvent("AppLaunch", {
        firstLoad: isFirstLoad ? "true" : "false",
        time: new Date().toString(),
      });

      // Update state first
      this.setState({ 
        showRealApp: !isFirstLoad, 
        loading: false 
      }, async () => {
        // This callback runs AFTER the state is set and the UI re-renders
        // Small delay to ensure the JS bridge is fully ready
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 200); 
      });

    } catch (e) {
      console.log(e);
      await SplashScreen.hideAsync(); // Hide even if there's an error
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


    // if (this.state.loading) return <ActivityIndicator size="large" />
    if (this.state.showRealApp) {
 
      return (
        <SafeAreaProvider>
          <NavigationContainer theme={theme} style={{ backgroundColor: colors.background.primary }}>
            <BottomNav />
          </NavigationContainer>
        </SafeAreaProvider>
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