import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const DetailsPage = () => {
  const [status, setStatus] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const dummyData = {
    title: "Günlük Video #1",
    description:
      "Bugün harika bir gündü! Sabah erkenden kalkıp sahilde yürüyüs yaptım...",
    videoUri:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "5",
    createdAt: "12 Mart 2024",
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white rounded-t-3xl -mt-5 pt-6 px-5 flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            {dummyData.title}
          </Text>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#ff4569" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row space-x-4 mb-6">
          <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
            <Ionicons name="time-outline" size={16} color="#4169E1" />
            <Text className="text-blue-600 ml-1 font-medium">
              {dummyData.duration}s
            </Text>
          </View>
          <View className="flex-row items-center bg-purple-50 px-3 py-1 rounded-full">
            <Ionicons name="calendar-outline" size={16} color="#7749BD" />
            <Text className="text-purple-600 ml-1 font-medium">
              {dummyData.createdAt}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 mb-6">
          <Text className="text-lg text-gray-700 leading-relaxed">
            {dummyData.description}
          </Text>
        </ScrollView>

        <View className="flex-row flex-wrap mb-4 justify-center">
          <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-600">#günlük</Text>
          </View>
          <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-600">#sahil</Text>
          </View>
          <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-600">#yürüyüş</Text>
          </View>
        </View>

        <View className="flex-row justify-around items-end pb-6">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-1">
              <Ionicons name="share-outline" size={24} color="#4169E1" />
            </View>
            <Text className="text-gray-600">Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center mb-1">
              <Ionicons name="pencil-outline" size={24} color="#34A853" />
            </View>
            <Text className="text-gray-600">Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mb-1">
              <Ionicons name="trash-outline" size={24} color="#EA4335" />
            </View>
            <Text className="text-gray-600">Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailsPage;
