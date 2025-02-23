import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import NoteTypeSelector from "@/components/CreateVideoNoteComponents/NoteTypeSelector";
import VideoNoteSection from "@/components/VideoNote/VideoNoteSection";
import TextNoteSection from "@/components/TextNote/TextNoteSection";
import { useVideoStore } from "@/store/useVideoStore";

const CreateVideoNote = () => {
  const [video, setVideo] = useState<{ uri: string } | null>(null);
  const [frames, setFrames] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [noteType, setNoteType] = useState<"video" | "text">("video");

  const videoSource = useVideoStore((state) => state.video?.filePath);
  const videoTime = useVideoStore((state) => state.video?.duration);

  // Formatlanmış süreyi hesaplıyoruz
  const formattedDuration = formatTime(videoTime ?? 0);

  return (
    <SafeAreaView className="flex-1  bg-gray-900">
      <NoteTypeSelector noteType={noteType} setNoteType={setNoteType} />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {noteType === "video" ? (
          <VideoNoteSection
            video={video}
            setVideo={setVideo}
            frames={frames}
            setFrames={setFrames}
            startTime={startTime}
            setStartTime={setStartTime}
            formattedDuration={formattedDuration}
            videoSource={videoSource ?? ""}
            videoTime={videoTime ?? 0}
          />
        ) : (
          <TextNoteSection />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateVideoNote;

const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
