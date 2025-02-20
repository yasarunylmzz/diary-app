import { View, Text } from "react-native";
import VideoCard from "./VideoCard";
import { Ionicons } from "@expo/vector-icons";

export default function VideoList() {
  // Örnek veri - daha sonra store'dan gelecek
  const emptyState = true;

  if (emptyState) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="videocam-outline" size={32} color="#9CA3AF" />
        </View>
        <Text className="text-gray-500 text-lg font-medium">No videos yet</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Tap the + button to add your first video
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      <VideoCard />
      <VideoCard />
      <VideoCard />
    </View>
  );
}
