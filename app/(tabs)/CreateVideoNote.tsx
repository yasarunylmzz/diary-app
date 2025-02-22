import { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";
import VideoPicker from "@/components/CreateVideoNoteComponents/VideoPicker";
import VideoPlayer from "@/components/CreateVideoNoteComponents/VideoPlayer";
import Timeline from "@/components/CreateVideoNoteComponents/Timeline";
import VideoNoteForm from "@/components/CreateVideoNoteComponents/VideoNoteForm";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const CreateVideoNote = () => {
  const [video, setVideo] = useState<{ uri: string } | null>(null);
  const [frames, setFrames] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [noteType, setNoteType] = useState<"video" | "text">("video");

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Note Type Selector */}
      <View className="flex-row mx-4 mt-4 mb-6 bg-gray-800 rounded-xl p-1">
        ß
        <TouchableOpacity
          className={`flex-1 items-center py-3 rounded-xl ${
            noteType === "video" ? "bg-blue-600" : "bg-transparent"
          }`}
          onPress={() => setNoteType("video")}
        >
          <Text
            className={`text-sm font-semibold ${
              noteType === "video" ? "text-white" : "text-gray-400"
            }`}
          >
            Video Not
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 rounded-xl ${
            noteType === "text" ? "bg-purple-600" : "bg-transparent"
          }`}
          onPress={() => setNoteType("text")}
        >
          <Text
            className={`text-sm font-semibold ${
              noteType === "text" ? "text-white" : "text-gray-400"
            }`}
          >
            Normal Not
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {noteType === "video" ? (
          !video ? (
            <View className="flex-1 justify-center">
              <VideoPicker onVideoPicked={setVideo} />
            </View>
          ) : (
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={() => setVideo(null)}
                  className="p-2 bg-gray-800 rounded-full shadow-lg shadow-black/50 border border-gray-700"
                >
                  <Ionicons name="arrow-back" size={22} color="#818CF8" />
                </TouchableOpacity>
                <Text className="text-gray-400 text-sm">
                  Video Süresi: 00:00
                </Text>
              </View>

              <View className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
                <VideoPlayer videoUri={video.uri} startTime={startTime} />
              </View>

              <View className="h-24 mb-6">
                <Timeline
                  frames={frames}
                  onUpdateSelection={setStartTime}
                  videoDuration={0}
                />
              </View>

              <VideoNoteForm
                onSave={(note: any) => console.log("Saved note:", note)}
              />
            </View>
          )
        ) : (
          <View className="flex-1">
            <Text className="text-gray-100 text-lg font-semibold mb-4">
              Yeni Metin Notu
            </Text>

            <View className="bg-gray-800 rounded-2xl p-4">
              <TextInput
                placeholder="Başlık"
                placeholderTextColor="#6B7280"
                className="text-gray-100 text-lg font-semibold mb-4"
              />

              <TextInput
                placeholder="Notunuzu buraya yazın..."
                placeholderTextColor="#6B7280"
                multiline
                className="text-gray-300 text-base h-48"
              />

              <View className="flex-row justify-between items-center mt-6">
                <TouchableOpacity className="flex-row items-center bg-gray-700 px-4 py-2 rounded-full">
                  <Ionicons name="pricetag-outline" size={18} color="#818CF8" />
                  <Text className="text-gray-300 ml-2">Etiket Ekle</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-full">
                  <Text className="text-white font-semibold">Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateVideoNote;
