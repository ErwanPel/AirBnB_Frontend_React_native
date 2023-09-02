import {
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import Lotties from "../components/Lotties";

export default function MapAroundMe({ navigation }) {
  const [coords, setCoords] = useState({
    latitude: 48.866667,
    longitude: 2.333333,
  });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const askPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        let latitude = "";
        let longitude = "";

        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync();

          // Pour mettre à jour la carte sur la zone de l'utilisateur
          // setCoords({
          //   latitude: location.coords.latitude,
          //   longitude: location.coords.longitude,
          // });

          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
        } else {
          if (Platform.OS === "android") {
            alert(
              "acces to location denied. If you want enable the location, you have to change change permission in your phone : Setting => Location => AirBNB app => allow location"
            );
          } else {
            alert(
              "Acces to location denied. If you want enable the location, you have to change change permission in your phone : Setting => AirBNB app => Position => allow location"
            );
          }
        }
        try {
          console.log("axioooooooooooos", coords.latitude, coords.longitude);
          const response = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );

          // Avec les vrais coordonnées GPS
          // const response = await axios.get(
          //   `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
          // );

          setData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log("axios", error);
        }
      } catch (error) {
        console.log("location", error);
      }
    };

    askPermission();
  }, []);

  return isLoading ? (
    <View style={styles.backgroundLotties}>
      <Lotties />
    </View>
  ) : (
    <MapView
      showsUserLocation={true}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        longitudeDelta: 0.2,
        latitudeDelta: 0.2,
      }}
    >
      {data.map((marker) => {
        return (
          <Marker
            key={marker._id}
            coordinate={{
              latitude: marker.location[1],
              longitude: marker.location[0],
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => navigation.navigate("RoomMap", { id: marker._id })}
          />
        );
      })}
    </MapView>
  );

  // );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  backgroundLotties: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
