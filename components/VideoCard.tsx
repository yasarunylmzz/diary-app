import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import "../global.css";
import { Link } from "expo-router";

interface VideoCardProps {
  title: string;
  description: string;
  videoUri: string;
  duration: string;
  createdAt: string;
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
    generateThumbnail();
  }, [videoUri]);

  const generateThumbnail = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.loadAsync({ uri: videoUri }, {}, false);
        setThumbnail(videoUri);
        await videoRef.current.unloadAsync();
      }
    } catch (error) {
      console.log("Thumbnail generation error:", error);
    }
  };

  const handlePressIn = async () => {
    if (videoRef.current) {
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
      className="bg-white rounded-2xl overflow-hidden mx-4 mb-4 shadow-md"
      href={"/DetailsPage"}
    >
      <View className="w-full bg-gray-800" style={{ height: videoHeight }}>
        {isPlaying ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            className="w-full h-full"
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
          />
        ) : (
          <Image
            source={{ uri: thumbnail || undefined }}
            className="w-full h-full"
            resizeMode="contain"
          />
        )}
      </View>

      <View className="p-4">
        <Text
          className="text-lg font-bold text-gray-900 mb-2"
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          className="text-sm text-gray-600 mb-4 leading-5"
          numberOfLines={2}
        >
          {description}
        </Text>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center bg-gray-100 py-2 px-4 rounded-xl border border-gray-200">
            <Ionicons name="time-outline" size={16} color="#4f46e5" />
            <Text className="text-sm font-semibold text-indigo-600 ml-2">
              {duration}s
            </Text>
          </View>

          <View className="flex-row items-center bg-gray-100 py-2 px-4 rounded-xl border border-gray-200">
            <Ionicons name="calendar-outline" size={16} color="#4f46e5" />
            <Text className="text-sm font-semibold text-indigo-600 ml-2">
              {createdAt}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
}
