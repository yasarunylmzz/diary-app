import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useVideoStore } from "@/store/useVideoStore";
import RNFS from "react-native-fs";
import { trimVideo } from "@/script/trimVideo";
import { useNavigation } from "@react-navigation/native";
import createVideoNotes, { getVideoNotes } from "@/db/schema";

const VideoNoteForm = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const {
    videoResponse,
    selectedStartTime,
    selectedEndTime,
    setVideoResponse,
    clearVideoResponse,
  } = useVideoStore();
  const [note, setNote] = useState({ name: "", description: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const handleSaveNote = async () => {
    if (!note.name.trim() || !note.description.trim()) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen başlık ve açıklama alanlarını doldurun"
      );
      return;
    }

    try {
      setIsProcessing(true);
      const trimmedPath = await trimVideo();

      const cleanupTasks = [
        ...(videoResponse?.video_url
          ? [RNFS.unlink(videoResponse.video_url)]
          : []),
        ...(videoResponse?.frames?.map((frame) =>
          RNFS.unlink(frame).catch(() => {})
        ) || []),
      ];

      await Promise.all(cleanupTasks);

      const videoEntry = {
        name: note.name,
        description: note.description,
        filePath: trimmedPath,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      };

      await createVideoNotes(videoEntry);

      const { success, data } = await getVideoNotes();

      Alert.alert("Başarılı", "Notunuz ve video başarıyla kaydedildi 🎉");
    } catch (error) {
      Alert.alert(
        "Hata Oluştu",
        error instanceof Error
          ? error.message
          : "Video işleme sırasında bir sorun oluştu"
      );
    } finally {
      setIsProcessing(false);
      await getVideoNotes();
      clearVideoResponse();
    }
  };

  const buttonScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1],
  });

  const CharacterCounter = ({ text, max }: { text: string; max: number }) => {
    const count = text.length;
    const color =
      count > max ? "#ef4444" : count > max * 0.8 ? "#f59e0b" : "#64748b";

    return (
      <Text
        className="text-right mt-1.5"
        style={{ color, fontSize: 11, lineHeight: 16 }}
      >
        {count}/{max}
      </Text>
    );
  };

  return (
    <View
      className="bg-gray-900 rounded-xl"
      style={{
        width: width - 24,
        shadowColor: "#020617",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center mb-5">
        <FontAwesome
          name="video-camera"
          size={20}
          color="#3B82F6"
          style={{ marginRight: 10 }}
        />
        <Text className="text-white text-xl font-bold tracking-tight">
          Video Not Kaydı
        </Text>
      </View>

      <View className="bg-gray-800/60 rounded-lg p-3 mb-4 border border-gray-700/50">
        <View className="flex-row justify-between mb-2">
          <Text className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
            BAŞLIK
          </Text>
          <FontAwesome name="tag" size={12} color="#60a5fa" />
        </View>
        <TextInput
          className="text-white text-[15px] leading-5 pb-1.5"
          placeholder="Örneğin: 'Yeni Ürün Lansmanı'"
          placeholderTextColor="#64748b"
          value={note.name}
          onChangeText={(text) => setNote((p) => ({ ...p, name: text }))}
          maxLength={50}
          style={{ height: 34 }}
          selectionColor="#3B82F6"
        />
        <CharacterCounter text={note.name} max={50} />
      </View>

      <View className="bg-gray-800/60 rounded-lg p-3 mb-6 border border-gray-700/50">
        <View className="flex-row justify-between mb-2">
          <Text className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
            AÇIKLAMA
          </Text>
          <FontAwesome name="align-left" size={12} color="#60a5fa" />
        </View>
        <TextInput
          className="text-white text-[15px] leading-5 pb-1.5"
          placeholder="Detayları buraya yazın..."
          placeholderTextColor="#64748b"
          multiline
          value={note.description}
          onChangeText={(text) => setNote((p) => ({ ...p, description: text }))}
          maxLength={500}
          style={{ minHeight: 100, textAlignVertical: "top" }}
          selectionColor="#3B82F6"
        />
        <CharacterCounter text={note.description} max={500} />
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          className={`bg-blue-600 rounded-lg py-3.5 ${
            isProcessing ? "opacity-90" : ""
          }`}
          onPress={handleSaveNote}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          <View className="flex-row items-center justify-center space-x-2">
            <FontAwesome
              name={isProcessing ? "circle-o-notch" : "save"}
              size={16}
              color="white"
              style={isProcessing ? { transform: [{ rotate: "90deg" }] } : {}}
            />
            <Text className="text-white text-base font-semibold tracking-wide">
              {isProcessing ? "KAYDEDİLİYOR..." : "NOTU KAYDET"}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default VideoNoteForm;
