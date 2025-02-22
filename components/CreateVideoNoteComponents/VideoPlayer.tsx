import { Video } from "expo-av";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useRef } from "react";

const VideoPlayer = ({ videoUri, startTime }: any) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.setPositionAsync(startTime * 1000);
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View className="w-full aspect-video rounded-2xl overflow-hidden bg-black mb-4 shadow-lg">
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        className="w-full h-full"
        useNativeControls={false}
      />

      <TouchableOpacity
        className="absolute inset-0 items-center justify-center bg-black/30"
        onPress={togglePlayback}
      >
        <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={30}
            color="#fff"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPlayer;
