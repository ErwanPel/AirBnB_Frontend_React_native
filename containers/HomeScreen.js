import {
  Button,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import RateBar from "../components/RateBar";

export default function HomeScreen({ height, width, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");

  const styles = useStyle(width, height);

  const intl = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );

        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator size={24} color="red" style={styles.loading} />
  ) : (
    <FlatList
      contentContainerStyle={[styles.centerAlign, styles.scrollview]}
      data={data}
      keyExtractor={(item) => String(item._id)}
      renderItem={({ item }) => {
        // console.log(JSON.stringify(item, null, 2));

        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("Room", { id: item._id })}
          >
            <View style={styles.card}>
              <View style={styles.centerAlign}>
                <Image
                  source={{ uri: item.photos[0].url }}
                  style={styles.picture}
                />
                <View style={styles.price}>
                  <Text style={styles.textPrice}>
                    {intl.format(item.price)}
                  </Text>
                </View>
              </View>
              <View style={styles.info}>
                <View style={styles.infoData}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.title}
                  </Text>
                  <View style={[styles.flexRow, styles.centerAlign]}>
                    <RateBar rating={item.ratingValue} />
                    <Text style={styles.reviewText}>{` ${item.reviews} review${
                      item.reviews > 1 ? "s" : ""
                    }`}</Text>
                  </View>
                </View>
                <View>
                  <Image
                    source={{ uri: item.user.account.photo.url }}
                    style={styles.pictureProfil}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const useStyle = (width, height) => {
  const styles = StyleSheet.create({
    loading: {
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    scrollview: {
      width: "100%",
      backgroundColor: "white",
    },
    card: {
      borderBottomWidth: 1,
      borderBottomColor: "#B0B0B0",
      width: 350,
      paddingVertical: 20,
    },
    centerAlign: {
      alignItems: "center",
    },
    flexRow: {
      flexDirection: "row",
    },
    info: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 10,
    },
    infoData: {
      justifyContent: "space-between",

      width: "75%",
    },
    picture: {
      width: "100%",
      height: 185,
    },
    pictureProfil: {
      width: 80,
      height: 80,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "black",
    },
    title: {
      fontSize: 17,

      fontStyle: "italic",
      fontWeight: "bold",
      color: "#0D0D0D",
    },
    price: {
      position: "absolute",

      backgroundColor: "black",
      width: 100,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      bottom: 10,
      left: 0,
    },
    textPrice: {
      fontSize: 20,
      color: "white",
    },
    reviewText: {
      width: 100,
      color: "grey",
    },
  });
  return styles;
};

/* <View>
      <Text>Welcome home!</Text>
      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      />
    </View> */
