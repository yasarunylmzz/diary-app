import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getVideoNotes } from "@/db/schema";

const DetailsPage = () => {
  const [status, setStatus] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  interface VideoDetail {
    id: string;
    title: string;
    description: string;
    videoUri: string;
    duration: number;
    createdAt: string;
  }

  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setIsLoading(true);
        const { success, data } = await getVideoNotes();
        if (success) {
          const formattedVideos = data.map((video: any) => ({
            id: video.id,
            title: video.name,
            description: video.description,
            videoUri: video.filePath,
            duration: video.endTime - video.startTime,
            createdAt: new Date(video.createdAt).toLocaleDateString("tr-TR"),
          }));

          const foundVideo = formattedVideos.find(
            (video: any) => video.id === id
          );
          if (foundVideo) {
            setVideoDetail(foundVideo);
          } else {
            setError("Video bulunamadı");
          }
        } else {
          setError("Veri alınamadı");
        }
      } catch (error) {
        setError("Veriler yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetail();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#818CF8" />
        <Text className="text-gray-300 mt-4">Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (error || !videoDetail) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-gray-300 mt-4">
          {error || "Video bulunamadı"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-gray-700 px-4 py-2 rounded-full"
        >
          <Text className="text-gray-100">Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="bg-gray-900 rounded-t-3xl -mt-5 pt-6 px-5 flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-700 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Text className="text-2xl font-bold text-gray-100">
            {videoDetail.title}
          </Text>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#EF4444" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row space-x-4 mb-6">
          <View className="flex-row items-center bg-indigo-900/30 px-3 py-1 rounded-full">
            <Ionicons name="time-outline" size={16} color="#818CF8" />
            <Text className="text-indigo-400 ml-1 font-medium">
              {videoDetail.duration}s
            </Text>
          </View>
          <View className="flex-row items-center bg-indigo-900/30 px-3 py-1 rounded-full">
            <Ionicons name="calendar-outline" size={16} color="#818CF8" />
            <Text className="text-indigo-400 ml-1 font-medium">
              {videoDetail.createdAt}
            </Text>
          </View>
        </View>

        {videoDetail.videoUri && (
          <View className="mb-4 rounded-xl overflow-hidden">
            <Video
              source={{ uri: videoDetail.videoUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay={false}
              useNativeControls
              style={{ height: 200 }}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          </View>
        )}

        <ScrollView className="flex-1 mb-6">
          <Text className="text-lg text-gray-300 leading-relaxed">
            {videoDetail.description}
          </Text>
        </ScrollView>

        <View className="flex-row flex-wrap mb-4 justify-center">
          <View className="bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-300">#günlük</Text>
          </View>
          <View className="bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-300">#sahil</Text>
          </View>
          <View className="bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-300">#yürüyüş</Text>
          </View>
        </View>

        <View className="flex-row justify-around items-end pb-6">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mb-1">
              <Ionicons name="share-outline" size={24} color="#818CF8" />
            </View>
            <Text className="text-gray-400">Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mb-1">
              <Ionicons name="pencil-outline" size={24} color="#34D399" />
            </View>
            <Text className="text-gray-400">Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mb-1">
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </View>
            <Text className="text-gray-400">Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailsPage;
