import React, { useState, useEffect } from 'react';
import { ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verticalScale, horizontalScale, moderateScale } from './styles/Styles';
import { colors, typography, spacing, borderRadius } from './styles/theme';
import * as SplashScreen from 'expo-splash-screen';
import Aptabase, { trackEvent } from "@aptabase/react-native";
import { LinearGradient } from 'expo-linear-gradient';

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
  const initialRoute = route.params?.needsPersonalInfo ? 'FirstLoad' : 'Home';
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, contentStyle: {backgroundColor: colors.background.primary}, navigationBarColor: colors.background.primary}}
    >
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
    paddingHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(60),
  },

  iconContainer: {
    width: horizontalScale(140),
    height: horizontalScale(140),
    borderRadius: horizontalScale(70),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(40),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },

  title: {
    fontSize: moderateScale(28),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: verticalScale(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  text: {
    fontSize: moderateScale(16),
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: moderateScale(24),
    paddingHorizontal: horizontalScale(10),
  },

  image: {
    width: horizontalScale(300),
    height: verticalScale(300),
    marginBottom: verticalScale(20),
  },

  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.accent.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotStyle: {
    backgroundColor: colors.border.secondary,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeDotStyle: {
    backgroundColor: colors.accent.primary,
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});


const slides = [
  {
    key: 'one',
    title: 'Welcome to ElderSafe',
    text: 'Your comprehensive home safety companion designed to help seniors and caregivers create safer, more accessible living spaces.',
    icon: 'home',
    gradient: [colors.accent.primary, colors.accent.secondary],
  },
  {
    key: 'two',
    title: 'Identify Hazards',
    text: 'Walk through your home room by room to discover potential safety hazards tailored to your specific mobility and accessibility needs.',
    icon: 'search',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    key: 'three',
    title: 'Track Your Progress',
    text: 'Monitor your safety improvements with intuitive progress tracking, status updates, and a detailed timeline of your home safety journey.',
    icon: 'chart-line',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    key: 'four',
    title: 'Get Personalized Tips',
    text: 'Receive customized product recommendations and safety tips based on your assessments to address identified hazards effectively.',
    icon: 'lightbulb',
    gradient: ['#4facfe', '#00f2fe'],
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
      showRealApp: false,
      needsPersonalInfo: false,
      loading: true,
    }
  }

  async componentDidMount() {
    try {
      // StatusBar.setBarStyle('light-content', true);

      if (__DEV__) {
        await AsyncStorage.clear();
}

      const value = await AsyncStorage.getItem('firstLoad');
      const personalInfo = await AsyncStorage.getItem('personalInfo');
      const isFirstLoad = value == null || value == undefined;
      const needsPersonalInfo = personalInfo == null || personalInfo == undefined;

      // Track the event
      trackEvent("AppLaunch", {
        firstLoad: isFirstLoad ? "true" : "false",
        time: new Date().toString(),
      });

      // Update state first
      this.setState({
        showRealApp: !isFirstLoad,
        needsPersonalInfo: needsPersonalInfo,
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
      <View style={introStyles.slide}>
        <LinearGradient
          colors={item.gradient}
          style={introStyles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 name={item.icon} size={70} color="#FFFFFF" />
        </LinearGradient>
        <Text style={introStyles.title}>{item.title}</Text>
        <Text style={introStyles.text}>{item.text}</Text>
      </View>
    );
  }

  _renderNextButton = () => {
    return (
      <View style={introStyles.buttonCircle}>
        <FontAwesome5 name="arrow-right" color="#FFFFFF" size={20} />
      </View>
    );
  }

  _renderDoneButton = () => {
    return (
      <View style={introStyles.buttonCircle}>
        <FontAwesome5 name="check" color="#FFFFFF" size={20} />
      </View>
    );
  }
  _onDone = async () => {
    // User finished the introduction. Check if they need to fill personal info
    await AsyncStorage.setItem('firstLoad', 'true');
    const personalInfo = await AsyncStorage.getItem('personalInfo');
    const needsPersonalInfo = personalInfo == null || personalInfo == undefined;

    this.setState({
      showRealApp: true,
      needsPersonalInfo: needsPersonalInfo
    });
  }

  render() {


    // if (this.state.loading) return <ActivityIndicator size="large" />
    if (this.state.showRealApp) {

      return (
        <SafeAreaProvider>
          <NavigationContainer theme={theme} style={{ backgroundColor: colors.background.primary }}>
            <Tab.Navigator
              initialRouteName="HomeScreens"
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
                initialParams={{ needsPersonalInfo: this.state.needsPersonalInfo }}
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
          </NavigationContainer>
        </SafeAreaProvider>
      );
    } else {
      return (
        <AppIntroSlider
          data={slides}
          renderItem={this._renderItem}
          onDone={this._onDone}
          renderNextButton={this._renderNextButton}
          renderDoneButton={this._renderDoneButton}
          dotStyle={introStyles.dotStyle}
          activeDotStyle={introStyles.activeDotStyle}
          showSkipButton={true}
          skipLabel="Skip"
        />
      );
    }
  }
}