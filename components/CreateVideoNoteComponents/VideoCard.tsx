import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import "../../global.css";
import { Link } from "expo-router";
import { useVideoStore } from "@/store/useVideoStore";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  videoUri?: string;
  createdAt?: string;
  onPress?: () => void;
}

export default function VideoCard({
  id,
  title,
  description,
  videoUri,
  createdAt,
  onPress,
}: VideoCardProps) {
  const videoRef = useRef<Video>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = screenWidth * 0.55;
  console.log(id);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying) {
      timeoutId = setTimeout(async () => {
        if (videoRef.current) {
          try {
            await videoRef.current.pauseAsync();
            await videoRef.current.unloadAsync();
            setIsPlaying(false);
          } catch (error) {
            console.log("Error stopping video:", error);
          }
        }
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [isPlaying]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return (
      date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ` ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    );
  };

  return (
    <Link
      className="bg-gray-800 rounded-2xl overflow-hidden mx-4 mb-4 shadow-lg shadow-black/40"
      href={{
        pathname: "/DetailsPage",
        params: { id },
      }}
      onPress={() => useVideoStore.getState().setSelectedVideoId(id)}
    >
      <View className="w-full bg-gray-700" style={{ height: videoHeight }}>
        {videoUri ? (
          isPlaying ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              className="w-full h-full"
              resizeMode={ResizeMode.COVER}
              shouldPlay={true}
            />
          ) : (
            <Image
              source={{ uri: thumbnail || undefined }}
              className="w-full h-full"
              resizeMode="cover"
            />
          )
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-700 p-4">
            <Ionicons name="videocam-off-outline" size={48} color="#4B5563" />
            <Text className="text-gray-400 text-center mt-3 font-medium">
              Henüz video eklemediniz
            </Text>
            <Text className="text-gray-500 text-center mt-1 text-sm">
              Videoyu görüntülemek için dokunun
            </Text>
          </View>
        )}
      </View>

      <View className="p-4">
        <Text
          className="text-lg font-bold text-gray-100 mb-2"
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          className="text-sm text-gray-400 mb-4 leading-5"
          numberOfLines={2}
        >
          {description}
        </Text>

        {videoUri && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center bg-indigo-900/30 py-2 px-4 rounded-xl">
              <Ionicons name="calendar-outline" size={16} color="#818CF8" />
              <Text className="text-sm font-semibold text-indigo-400 ml-2">
                {formatDate(createdAt!)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Link>
  );
}
