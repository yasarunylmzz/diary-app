import { View, Text, TouchableOpacity } from "react-native";
import { FC } from "react";
import VideoPicker from "@/components/VideoNote/VideoPicker";
import VideoPlayer from "./VideoPlayer";
import Timeline from "./Timeline";
import VideoNoteForm from "./VideoNoteForm";
import { Ionicons } from "@expo/vector-icons";

interface VideoNoteSectionProps {
  video: { uri: string } | null;
  setVideo: (video: { uri: string } | null) => void;
  startTime: number;
  setStartTime: (time: number) => void;
  formattedDuration: string;
  videoSource: string;
  videoTime: number;
}

const VideoNoteSection: FC<VideoNoteSectionProps> = ({
  video,
  setVideo,
  startTime,
  setStartTime,
  formattedDuration,
  videoSource,
  videoTime,
}) => {
  if (!video) {
    return (
      <View className="flex-1 justify-center">
        <VideoPicker onVideoPicked={setVideo} />
      </View>
    );
  }

  return (
    <View className="flex-col">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => setVideo(null)}
          className="p-2 bg-gray-800 rounded-full shadow-lg shadow-black/50 border border-gray-700"
        >
          <Ionicons name="arrow-back" size={22} color="#818CF8" />
        </TouchableOpacity>
        <Text className="text-gray-400 text-sm">
          Video Time: {formattedDuration}
        </Text>
      </View>

      <View className="aspect-video bg-black rounded-2xl w-full overflow-hidden mb-6">
        <VideoPlayer videoUri={videoSource} />
      </View>

      <View className="h-24 mb-6">
        <Timeline
          onUpdateSelection={setStartTime}
          videoDuration={videoTime}
          initialPosition={startTime}
        />
      </View>

      <VideoNoteForm />
    </View>
  );
};

export default VideoNoteSection;
