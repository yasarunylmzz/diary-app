import { View, Text, StyleSheet } from "react-native";

export default function Edit() {
  return (
    <View style={styles.container}>
      <Text>Edit Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
