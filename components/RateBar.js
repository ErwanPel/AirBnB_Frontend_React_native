import { Text, View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function RateBar({ rating }) {
  const total = 5;
  let emptyRate = total - rating;

  let arrayRate = [];

  for (let i = 0; i < rating; i++) {
    arrayRate.push("full");
  }
  for (let i = 0; i < emptyRate; i++) {
    arrayRate.push("empty");
  }

  return (
    <View style={styles.ratingBloc}>
      {arrayRate.map((star) => {
        return (
          <View>
            {star === "full" && (
              <Entypo name="star" size={24} color="#E0A42E" />
            )}
            {star === "empty" && <Entypo name="star" size={24} color="grey" />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ratingBloc: {
    flexDirection: "row",
  },
});
