import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoList from "../../components/CreateVideoNoteComponents/VideoList";
import { getVideoNotes } from "@/db/schema";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
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
            createdAt: video.createdAt,
          }));
          setVideos(formattedVideos);
          setError(null);
        }
      } catch (error) {
        setError("Veriler yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={["top"]}>
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
        <VideoList videos={videos} isLoading={false} error={null} />
      </ScrollView>
    </SafeAreaView>
  );
}
