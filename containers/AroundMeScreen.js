import { Text, ActivityIndicator, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapAroundMe from "../components/MapAroundMe";
import axios from "axios";

export default function AroundMeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );

        setData(data);
        console.log(JSON.stringify("ici", data, null, 2));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return <MapAroundMe data={data} />;
}
