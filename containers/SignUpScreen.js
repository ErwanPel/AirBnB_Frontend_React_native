import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { useState } from "react";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUpScreen({ setToken, width, height }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);
  const navigation = useNavigation();

  const styles = useStyle(height, width);

  const fetchData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
        data
      );
      setLoading(false);
      const userToken = response.data.token;
      const userId = response.data.id;
      setToken(userToken, userId);
      alert("Le compte a été crée !");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrorMessage("This adress mail or username are already used");
    }
  };
  // nono@airbnb-api.com
  const handleSubmit = () => {
    setErrorMessage("");

    if (!email || !password || !username || !description) {
      setErrorMessage("Please fill all fields");
    } else {
      const reg = /^[\w\.\-]+[\w\.\-]*@[\w\.\-]{2,}\.[a-z_\.\-]+[a-z_\-]+$/;

      if (reg.test(email) === true) {
        console.log("ok mail");
        if (password === confirmPassword) {
          console.log("les mots de passe sont identiques");
          fetchData({ email, password, description, username });
        } else {
          setErrorMessage("The passwords are differents");
        }
      } else {
        setErrorMessage("You need to write an adress mail");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      enableAutomaticScroll
      // extraHeight={600}
    >
      <View style={[styles.center, styles.gap20]}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={[styles.bold, styles.title]}>Sign up</Text>
      </View>
      {Loading ? (
        <ActivityIndicator size={28} color="red" />
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

          <TextInput
            style={styles.input}
            placeholder="username"
            value={username}
            inputMode="email"
            onChangeText={(text) => setUsername(text)}
            placeholderTextColor="black"
          />

          <TextInput
            style={styles.inputDescription}
            placeholder="Describe yourself with a few words..."
            value={description}
            inputMode="email"
            onChangeText={(text) => setDescription(text)}
            multiline
            numberOfLines={5}
            maxLength={200}
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

          <View>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              secureTextEntry={hide}
              onChangeText={(text) => setConfirmPassword(text)}
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
      <View style={[styles.center, styles.gap20, styles.buttonBloc]}>
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
              <Text style={styles.textWidth}>SIGN IN</Text>
            </View>
          </LinearGradient>
        </TouchableHighlight>

        <TouchableOpacity
          style={styles.register}
          onPress={() => {
            navigation.navigate("SignIn");
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
      paddingBottom: 20,
      justifyContent: "space-around",
      gap: height * (8 / 100),
    },
    border: {
      borderWidth: 1,
    },
    logo: {
      width: 80,
      height: 80,
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
      fontSize: 24,
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
    },
    input: {
      borderBottomWidth: 1,
      borderColor: "red",
      marginBottom: 20,
      height: 50,
      fontSize: 16,
    },

    inputDescription: {
      borderColor: "red",
      marginVertical: 20,
      fontSize: 16,
      padding: 10,
      height: 120,
      borderWidth: 1,
      textAlignVertical: "top",
    },
    form: {
      paddingHorizontal: 30,
    },
    eye: {
      position: "absolute",
      top: 10,
      right: 20,
    },
    textLinearGradient: {
      backgroundColor: "white",
      borderRadius: 50,
      paddingHorizontal: Platform.OS === "android" ? 72 : 71,
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

{
  /* <Button
          title="Sign up"
          onPress={async () => {
            const userToken = "secret-token";
            setToken(userToken);
          }}
        /> */
}
