import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { useState } from "react";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Lotties from "../components/Lotties";

export default function SignInScreen({ setToken, width, height }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);
  const navigation = useNavigation();

  const styles = useStyle(height, width);

  // console.log(Platform.OS);

  const fetchData = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
        data
      );
      setLoading(false);
      const userToken = response.data.token;
      const userId = response.data.id;

      setToken(userToken, userId);
      alert("connexion réussi !");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrorMessage("This adress mail or password are incorrect");
    }
  };

  const handleSubmit = () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill all fields");
    } else {
      const reg = /^[\w\.\-]+[\w\.\-]*@[\w\.\-]{2,}\.[a-z_\.\-]+[a-z_\-]+$/;

      if (reg.test(email) === true) {
        console.log("ok mail");
        if (password) {
          console.log("ok password");
          fetchData({ email, password });
        } else {
          setErrorMessage("You need to write a password");
        }
      } else {
        setErrorMessage("You need to write an adress mail");
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={[styles.center, styles.gap20]}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={[styles.bold, styles.title]}>Sign in</Text>
      </View>
      {Loading ? (
        <View style={styles.backgroundLotties}>
          <Lotties />
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            inputMode="email"
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="black"
          />
          <View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry={hide}
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor="black"
            />
            {!hide && (
              <Entypo
                style={styles.eye}
                name="eye-with-line"
                size={28}
                color="black"
                onPress={() => setHide(!hide)}
              />
            )}
            {hide && (
              <Entypo
                style={styles.eye}
                name="eye"
                size={28}
                color="black"
                onPress={() => setHide(!hide)}
              />
            )}
          </View>
        </View>
      )}
      <View style={[styles.center, styles.gap20]}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <TouchableHighlight
          style={styles.button}
          onPress={handleSubmit}
          disabled={Loading}
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
            <View style={styles.textLinearGradient}>
              <Text style={styles.textWidth}>SIGN UP</Text>
            </View>
          </LinearGradient>
        </TouchableHighlight>

        <TouchableOpacity
          style={styles.register}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={[styles.textGrey, styles.textWidth]}>
            No account ? Register
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const useStyle = (height, width) => {
  const styles = StyleSheet.create({
    container: {
      paddingTop: Constants.statusBarHeight,
      justifyContent: "space-around",
      height: "100%",
      backgroundColor: "white",
      paddingBottom: 20,
    },
    backgroundLotties: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
    },
    border: {
      borderWidth: 1,
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: "contain",
    },
    center: {
      alignItems: "center",
    },
    gap20: {
      gap: 20,
    },
    bold: {
      fontWeight: "bold",
    },
    title: {
      fontSize: 28,
    },
    button: {
      width: 200,
      height: 60,
      borderRadius: 50,

      alignItems: "center",
      justifyContent: "center",
    },
    error: {
      color: "red",
      width: 350,
      textAlign: "center",
    },
    input: {
      borderBottomWidth: 1,
      borderColor: "red",
      marginBottom: 20,
      height: 60,
      fontSize: 16,
    },
    form: {
      paddingHorizontal: 30,
    },
    eye: {
      position: "absolute",
      top: 16,
      right: 20,
    },
    textLinearGradient: {
      backgroundColor: "white",
      borderRadius: 50,
      paddingHorizontal: Platform.OS === "android" ? 70 : 68,
      paddingVertical: Platform.OS === "android" ? 17 : 18,
    },
    textGrey: {
      color: "grey",
    },
    textWidth: {
      width: "100%",
      borderWidth: 1,
      borderColor: "transparent",
      textAlign: "center",
    },
    register: {
      width: 200,
    },
  });
  return styles;
};
