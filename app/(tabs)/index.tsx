import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoList from "../../components/CreateVideoNoteComponents/VideoList";
import { Link } from "expo-router";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={["top"]}>
      {/* Header */}
      <View className="px-6 py-4 bg-gray-900 ">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-extrabold text-gray-100">
              Anı Defterim
            </Text>
            <Text className="text-base text-gray-400 mt-1">
              Kayıtlı Videolarınız
            </Text>
          </View>
          <TouchableOpacity className="p-2 bg-gray-800 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="#60a5fa" />
          </TouchableOpacity>
        </View>

        <View className="mt-4 flex-row space-x-1">
          <View className="h-1 w-8 bg-gray-600 rounded-full" />
          <View className="h-1 w-8 bg-blue-500 rounded-full" />
          <View className="h-1 w-8 bg-gray-600 rounded-full" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <VideoList />
      </ScrollView>

      {/* <Link
        href={"/CreateVideoNote"}
        className="absolute bottom-8 right-6 w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center shadow-xl shadow-blue-500/30 active:bg-blue-700"
      >
        <View className="flex items-center w-full h-full font-extrabold justify-center">
          <Ionicons name="add" size={32} color="white" />
        </View>
      </Link> */}
    </SafeAreaView>
  );
}
