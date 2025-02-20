import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VideoCard() {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      {/* Video Thumbnail */}
      <View className="h-48 bg-gray-100">
        <Image
          source={{ uri: "https://placekitten.com/400/200" }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-md">
          <Text className="text-white text-xs">0:05</Text>
        </View>
      </View>

      {/* Video Info */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          Morning Walk
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          A beautiful morning walk in the park
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-400">Added 2 days ago</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
