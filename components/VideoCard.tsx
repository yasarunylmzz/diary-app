import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";

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
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          await videoRef.current.setPositionAsync(0);
          await new Promise((resolve) => setTimeout(resolve, 100));
          const thumbnail = await (videoRef.current as any).takeSnapshotAsync({
            quality: 0.5,
          });
          setThumbnail(thumbnail.uri);
          await videoRef.current.unloadAsync();
        }
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

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPlaying]);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        overflow: "hidden",
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
      activeOpacity={0.95}
      onPress={onPress}
      onPressIn={handlePressIn}
    >
      <View style={{ height: videoHeight, backgroundColor: "#1f2937" }}>
        {isPlaying ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
          />
        ) : (
          <Image
            source={{ uri: thumbnail || undefined }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: 8,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "#4b5563",
            marginBottom: 16,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {description}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f3f4f6",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Ionicons name="time-outline" size={16} color="#4f46e5" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#4f46e5",
                marginLeft: 6,
              }}
            >
              {duration}s
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f3f4f6",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Ionicons name="calendar-outline" size={16} color="#4f46e5" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#4f46e5",
                marginLeft: 6,
              }}
            >
              {createdAt}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
