import LottieView from "lottie-react-native";

export default function Lotties() {
  return (
    <LottieView
      autoPlay
      style={{
        width: 50,
        height: 50,
        backgroundColor: "white",
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={require("../assets/red.json")}
    />
  );
}
