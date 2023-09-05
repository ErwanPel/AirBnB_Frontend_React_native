import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Lotties from "../components/Lotties";

import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function ProfileScreen({ setToken, userToken, height, width }) {
  const [picture, setPicture] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [changeText, setChangeText] = useState(false);
  const [changePicture, setChangePicture] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const styles = useStyle(changeText, changePicture);

  console.log(changePicture, changeText);

  const handleChangeText = (setState, text, height, width) => {
    setErrorMessage("");
    setState(text);
    setChangeText(true);
  };

  const handleSubmit = async () => {
    if (changeText) {
      const reg = /^[\w\.\-]+[\w\.\-]*@[\w\.\-]{2,}\.[a-z_\.\-]+[a-z_\-]+$/;

      if (reg.test(email) === true) {
        setUpdate(true);
        try {
          const response = await axios.put(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
            { email: email, username: username, description: description },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          alert("Your profile have been modified");
          setUpdate(false);
          setChangeText(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrorMessage("This adress mail is not correct");
      }
    }
    if (changePicture) {
      setUpdate(true);
      const tab = picture.split(".");

      const formData = new FormData();

      formData.append("photo", {
        uri: picture,
        name: `profil.${tab.at(-1)}`,
        type: `image/${tab.at(-1)}`,
      });

      try {
        const response = await axios.put(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Your profile have been modified");
        setUpdate(false);
        setChangePicture(false);
      } catch (error) {
        console.log("erreur", JSON.stringify(error.response, null, 2));
      }
    }
  };

  const getPermissionAndOpenGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled) {
        alert("No picture have been selected");
      } else {
        setPicture(result.assets[0].uri);
        setChangePicture(true);
      }
    } else {
      if (Platform.OS === "android") {
        alert(
          "acces to librairy denied. If you want enable the librairy's access, you have to change change permission in your phone : Setting => Applications => AirBNB app => Authorizations => Photos & videos => authorize"
        );
      } else {
        alert(
          "Acces to librairy denied. If you want enable the librairy's access, you have to change change permission in your phone : Setting => AirBNB app => Photos => all photos or selected photos"
        );
      }
    }
  };

  const getPermissionAndOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled) {
        alert("No picture have been selected");
      } else {
        setPicture(result.assets[0].uri);
        setChangePicture(true);
      }
    } else {
      if (Platform.OS === "android") {
        alert(
          "acces to librairy denied. If you want enable the librairy's access, you have to change change permission in your phone : Setting => Applications => AirBNB app => Authorizations => Camera => authorize"
        );
      } else {
        alert(
          "Acces to librairy denied. If you want enable the librairy's access, you have to change change permission in your phone : Setting => AirBNB app => change the toggle for camera"
        );
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const getUserData = async () => {
      try {
        let userId = await AsyncStorage.getItem("userId");
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setEmail(response.data.email);
        setUsername(response.data.username);
        setPicture(response.data.photo);
        setDescription(response.data.description);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    getUserData();
  }, []);

  return isLoading ? (
    <View style={styles.backgroundLotties}>
      <Lotties />
    </View>
  ) : (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableAutomaticScroll
      style={styles.screen}
    >
      <View style={[styles.flexRow, styles.gap20]}>
        <View style={styles.viewPicture}>
          {!picture ? (
            <FontAwesome5 name="user-alt" size={60} color="grey" />
          ) : picture.url ? (
            <Image source={{ uri: picture.url }} style={styles.picture} />
          ) : (
            <Image source={{ uri: picture }} style={styles.picture} />
          )}
        </View>
        <View style={styles.addImageBloc}>
          <TouchableOpacity onPress={getPermissionAndOpenGallery}>
            <Ionicons name="images" size={30} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndOpenCamera}>
            <Ionicons name="camera" size={30} color="grey" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder={email}
        placeholderTextColor="black"
        value={email}
        inputMode="email"
        onChangeText={(text) => handleChangeText(setEmail, text)}
      />
      <TextInput
        style={styles.input}
        placeholder={username}
        placeholderTextColor="black"
        value={username}
        inputMode="email"
        onChangeText={(text) => handleChangeText(setUsername, text)}
      />
      <TextInput
        style={styles.inputDescription}
        multiline
        placeholder={description}
        numberOfLines={5}
        maxLength={200}
        placeholderTextColor="black"
        value={description}
        inputMode="email"
        onChangeText={(text) => handleChangeText(setDescription, text)}
      />
      <View style={styles.gap20}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {update ? (
          <Lotties />
        ) : (
          <TouchableHighlight
            style={styles.button}
            onPress={handleSubmit}
            disabled={!changeText && !changePicture}
            underlayColor={`#cc0000`}
          >
            <LinearGradient
              // Button Linear Gradient
              colors={["#cc1100", "#F9585D", "#cc1100"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
              locations={[0, 0.5, 1]}
            >
              <View style={styles.updateLinearGradient}>
                <Text style={styles.textWidth}>UPDATE</Text>
              </View>
            </LinearGradient>
          </TouchableHighlight>
        )}

        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            setToken(null, null);
          }}
          underlayColor={`#cc0000`}
        >
          <LinearGradient
            // Button Linear Gradient
            colors={["#cc1100", "#F9585D", "#cc1100"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
            locations={[0, 0.5, 1]}
          >
            <View style={styles.logOutLinearGradient}>
              <Text style={styles.textWidth}>LOG OUT</Text>
            </View>
          </LinearGradient>
        </TouchableHighlight>
      </View>
    </KeyboardAwareScrollView>
  );
}

const useStyle = (changeText, changePicture, height, width) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: 20,
      backgroundColor: "white",
      heigth: height,
      borderTopWidth: 1,
      borderTopColor: "grey",
      justifyContent: "space-around",
    },
    screen: {
      backgroundColor: "white",
    },
    backgroundLotties: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
    },

    viewPicture: {
      borderWidth: 1,
      height: 125,
      width: 125,
      borderRadius: 75,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "red",
    },
    picture: {
      width: 125,
      height: 125,
      borderRadius: 75,
      resizeMode: "contain",
    },
    flexRow: {
      flexDirection: "row",
    },
    gap20: {
      gap: 20,
      alignItems: "center",
    },
    addImageBloc: {
      justifyContent: "space-around",
      height: 125,
    },
    input: {
      borderBottomWidth: 1,
      borderColor: "red",
      marginBottom: 20,
      height: 50,
      fontSize: 16,
      width: "80%",
      marginVertical: 20,
    },

    inputDescription: {
      borderColor: "red",
      marginVertical: 20,
      fontSize: 16,
      padding: 10,
      height: 120,
      borderWidth: 1,
      textAlignVertical: "top",
      width: "80%",
      marginBottom: 80,
    },
    button: {
      width: 200,
      height: 60,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },

    logOutLinearGradient: {
      backgroundColor: "white",
      borderRadius: 50,
      paddingHorizontal: Platform.OS === "android" ? 67 : 65,
      paddingVertical: 17,
    },
    updateLinearGradient: {
      backgroundColor: !changeText && !changePicture ? "#BFBFBF" : "white",
      borderRadius: 50,
      paddingHorizontal: Platform.OS === "android" ? 70 : 69,
      paddingVertical: 17,
    },

    textWidth: {
      width: "100%",
      borderWidth: 1,
      borderColor: "transparent",
      textAlign: "center",
    },
    error: {
      color: "red",
    },
  });
  return styles;
};
