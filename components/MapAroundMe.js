import {
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function MapAroundMe({ data }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState();

  useEffect(() => {
    const askPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync();

          setCoords(location.coords);
        } else {
          setError(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    askPermission();
  }, []);

  return isLoading ? (
    <ActivityIndicator size={24} color={"red"} />
  ) : error ? (
    <Text>Permission refusé</Text>
  ) : (
    <>
      <MapView
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {data.map((mark) => {
          console.log(mark._id);
          return (
            <TouchableOpacity>
              <Marker
                key={mark._id}
                coordinate={{
                  latitude: mark.location[1],
                  longitude: mark.location[0],
                }}
                title={mark.title}
                description={mark.description}
              />
            </TouchableOpacity>
          );
        })}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
  },
});
