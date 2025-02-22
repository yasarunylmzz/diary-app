import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import "../../global.css";
import { Link } from "expo-router";

interface VideoCardProps {
  title: string;
  description: string;
  videoUri?: string;
  duration?: string;
  createdAt?: string;
  onPress?: () => void;
}

export default function VideoCard({
  title,
  description,
  videoUri,
  duration,
  createdAt,
  onPress,
}: VideoCardProps) {
  const videoRef = useRef<Video>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = screenWidth * 0.55;

  useEffect(() => {
    if (videoUri) {
      generateThumbnail();
    }
  }, [videoUri]);

  const generateThumbnail = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.loadAsync({ uri: videoUri! }, {}, false);
        if (videoUri) {
          setThumbnail(videoUri);
        }
        await videoRef.current.unloadAsync();
      }
    } catch (error) {
      console.log("Thumbnail generation error:", error);
    }
  };

  const handlePressIn = async () => {
    if (videoRef.current && videoUri) {
      setIsPlaying(true);
      try {
        await videoRef.current.loadAsync({ uri: videoUri }, {}, false);
        await videoRef.current.setPositionAsync(0);
        await videoRef.current.playAsync();
      } catch (error) {
        console.log("Preview playback error:", error);
        setIsPlaying(false);
      }
    }
  };

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

  return (
    <Link
      className="bg-gray-800 rounded-2xl overflow-hidden mx-4 mb-4 shadow-lg shadow-black/40"
      href={videoUri ? "/DetailsPage" : ""}
      onPress={!videoUri ? onPress : undefined}
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
              <Ionicons name="time-outline" size={16} color="#818CF8" />
              <Text className="text-sm font-semibold text-indigo-400 ml-2">
                {duration}s
              </Text>
            </View>

            <View className="flex-row items-center bg-indigo-900/30 py-2 px-4 rounded-xl">
              <Ionicons name="calendar-outline" size={16} color="#818CF8" />
              <Text className="text-sm font-semibold text-indigo-400 ml-2">
                {createdAt}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Link>
  );
}
