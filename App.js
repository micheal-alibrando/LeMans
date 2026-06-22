import { enableScreens } from "react-native-screens";
enableScreens();

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FriendsScreen from "./src/screens/FriendsScreen";
import OnBoardingScreen from "./src/screens/OnBoardingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnBoarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="OnBoarding">
          {(props) => (
            <OnBoardingScreen
              {...props}
              onGoToLogin={() => props.navigation.navigate("Signup")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Users" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
