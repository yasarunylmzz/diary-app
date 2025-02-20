import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoList from "../../components/VideoList";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Video Diary</Text>
        <Text className="text-sm text-gray-500 mt-1">Your video memories</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          <VideoList />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
