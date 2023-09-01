import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SplashScreen from "./containers/SplashScreen";
import AroundMeScreen from "./containers/AroundMeScreen";

import { useWindowDimensions, Image, StyleSheet } from "react-native";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const { height, width } = useWindowDimensions();

  const setToken = async (token, id) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }
    if (id) {
      await AsyncStorage.setItem("userId", id);
    } else {
      await AsyncStorage.removeItem("UserId");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => (
                <SignInScreen
                  setToken={setToken}
                  height={height}
                  width={width}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => (
                <SignUpScreen
                  setToken={setToken}
                  height={height}
                  width={width}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          headerStyle: { backgroundColor: "white" },
                          headerTitleAlign: "center",
                          headerTitle: () => {
                            return (
                              <Image
                                style={styles.logo}
                                source={require("./assets/logo.png")}
                              />
                            );
                          },
                        }}
                      >
                        {(props) => (
                          <HomeScreen
                            {...props}
                            height={height}
                            width={width}
                          />
                        )}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        options={{
                          headerStyle: { backgroundColor: "white" },
                          headerTitleAlign: "center",
                          headerTitle: () => {
                            return (
                              <Image
                                style={styles.logo}
                                source={require("./assets/logo.png")}
                              />
                            );
                          },
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name="location-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Around Me"
                        options={{
                          headerStyle: { backgroundColor: "white" },
                          headerTitleAlign: "center",
                          headerTitle: () => {
                            return (
                              <Image
                                style={styles.logo}
                                source={require("./assets/logo.png")}
                              />
                            );
                          },
                        }}
                      >
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="RoomMap"
                        options={{
                          headerStyle: { backgroundColor: "white" },
                          headerTitleAlign: "center",
                          headerTitle: () => {
                            return (
                              <Image
                                style={styles.logo}
                                source={require("./assets/logo.png")}
                              />
                            );
                          },
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="user" size={24} color="black" />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="MyProfile"
                        options={{
                          headerStyle: { backgroundColor: "white" },
                          headerTitleAlign: "center",
                          headerTitle: () => {
                            return (
                              <Image
                                style={styles.logo}
                                source={require("./assets/logo.png")}
                              />
                            );
                          },
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            setToken={setToken}
                            userToken={userToken}
                            {...props}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
