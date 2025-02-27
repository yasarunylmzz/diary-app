import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VideoCard from "./VideoCard";
import { useRouter } from "expo-router";

type Video = {
  id: number;
  title: string;
  videoUri: string;
  description: string;
  duration: number;
  createdAt: string;
};

type VideoListProps = {
  videos: Video[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export default function VideoList({
  videos = [],
  isLoading = false,
  error = null,
  onRefresh,
  isRefreshing = false,
}: VideoListProps) {
  const router = useRouter();

  const handleVideoPress = (videoId: number) => {
    router.push({
      pathname: "/details",
      params: { id: videoId },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#818CF8" />
        <Text className="text-gray-500 mt-3">Videolar yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        <Text className="text-center text-gray-500 mt-2">{error}</Text>
        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            className="mt-4 bg-indigo-600 px-4 py-2 rounded-full"
          >
            <Text className="text-white">Tekrar Dene</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Ionicons name="videocam-outline" size={40} color="#4b5563" />
        <Text className="text-center text-gray-500 mt-2 text-sm px-8">
          Henüz video eklemediniz, alttaki butondan ilk anınızı kaydedin!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <VideoCard
          title={item.title}
          description={item.description}
          videoUri={item.videoUri}
          createdAt={item.createdAt}
          onPress={() => handleVideoPress(item.id)}
          id={""}
        />
      )}
      className="flex-1"
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}
