import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        headerShown: false,
        tabBarStyle: {
          borderTopColor: "transparent",
          elevation: 10,
          borderTopWidth: 0,
          backgroundColor: "#111827",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Video Notes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CreateVideoNote"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                top: -20,
                backgroundColor: "rgba(99, 102, 241, 0.9)",
                borderRadius: 35,
                width: 70,
                height: 70,
                shadowColor: "#6366f1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="add"
                size={40}
                color="white"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.2)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
