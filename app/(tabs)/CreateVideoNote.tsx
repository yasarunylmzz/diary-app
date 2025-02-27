import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import NoteTypeSelector from "@/components/CreateVideoNoteComponents/NoteTypeSelector";
import VideoNoteSection from "@/components/VideoNote/VideoNoteSection";
import TextNoteSection from "@/components/TextNote/TextNoteSection";
import { useVideoStore } from "@/store/useVideoStore";

const CreateVideoNote = () => {
  const [video, setVideo] = useState<{ uri: string } | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [noteType, setNoteType] = useState<"video" | "text">("video");

  const videoResponse = useVideoStore((state) => state.videoResponse);
  const videoUrl = videoResponse?.video_url || "";
  const frameCount = videoResponse?.frame_count || 0;

  const formattedDuration = formatTime(frameCount);
  const videoDuration = frameCount;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <NoteTypeSelector noteType={noteType} setNoteType={setNoteType} />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {noteType === "video" ? (
          <VideoNoteSection
            video={video}
            setVideo={setVideo}
            startTime={startTime}
            setStartTime={setStartTime}
            formattedDuration={formattedDuration}
            videoSource={videoUrl}
            videoTime={videoDuration}
          />
        ) : (
          <TextNoteSection />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateVideoNote;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
