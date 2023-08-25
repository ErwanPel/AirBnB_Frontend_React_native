import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import RateBar from "../components/RateBar";
import { AntDesign } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");
  const [visibleDescription, setVisibleDescription] = useState(false);

  const { params } = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${params.id}`
        );
        console.log("room==============>", JSON.stringify(data, null, 2));
        setData(data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const intl = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });

  return isLoading ? (
    <ActivityIndicator size={24} color="red" style={styles.loading} />
  ) : (
    <ScrollView contentContainerStyle={styles.centerAlign}>
      <View style={styles.card}>
        <Image source={{ uri: data.photos[0].url }} style={styles.picture} />
        <View style={styles.price}>
          <Text style={styles.textPrice}>{intl.format(data.price)}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.infoData}>
          <Text numberOfLines={1} style={styles.title}>
            {data.title}
          </Text>
          <View style={[styles.flexRow, styles.centerAlign]}>
            <RateBar rating={data.ratingValue} />
            <Text style={styles.reviewText}>{` ${data.reviews} review${
              data.reviews > 1 ? "s" : ""
            }`}</Text>
          </View>
        </View>
        <View>
          <Image
            source={{ uri: data.user.account.photo.url }}
            style={styles.pictureProfil}
          />
        </View>
      </View>
      <View style={styles.descriptionBloc}>
        <Text numberOfLines={!visibleDescription ? 3 : 0}>
          {data.description}
        </Text>
        {!visibleDescription && (
          <TouchableOpacity
            onPress={() => setVisibleDescription(!visibleDescription)}
            style={styles.button}
          >
            <Text>
              See more <AntDesign name="caretdown" size={14} color="black" />
            </Text>
          </TouchableOpacity>
        )}
        {visibleDescription && (
          <TouchableOpacity
            onPress={() => setVisibleDescription(!visibleDescription)}
            style={styles.button}
          >
            <Text>
              See less <AntDesign name="caretup" size={14} color="black" />
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.map}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    aligndatas: "center",
    justifyContent: "center",
    height: "100%",
  },
  card: {
    width: "100%",
  },
  centerAlign: {
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  picture: {
    width: "100%",
    height: 275,
    resizeMode: "contain",
  },
  pictureProfil: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "black",
  },
  price: {
    position: "absolute",

    backgroundColor: "black",
    width: 100,
    height: 50,
    aligndatas: "center",
    justifyContent: "center",
    bottom: 20,
    left: 0,
  },
  textPrice: {
    fontSize: 24,
    color: "white",
    width: 80,
    textAlign: "center",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 10,
  },
  infoData: {
    justifyContent: "space-between",

    width: "75%",
  },
  title: {
    fontSize: 18,

    fontStyle: "italic",
    fontWeight: "bold",
    color: "#0D0D0D",
  },
  reviewText: {
    width: 100,
    color: "grey",
  },
  descriptionBloc: {
    padding: 20,
    gap: 10,
  },
  button: {
    width: 120,
    paddingVertical: 10,
    paddingRight: 10,
  },
  map: {
    height: 400,
    borderWidth: 1,
    width: "100%",
    backgroundColor: "green",
  },
});
