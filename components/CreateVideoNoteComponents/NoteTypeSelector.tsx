import { TouchableOpacity, Text, View } from "react-native";
import { FC } from "react";

interface NoteTypeSelectorProps {
  noteType: "video" | "text";
  setNoteType: (type: "video" | "text") => void;
}

const NoteTypeSelector: FC<NoteTypeSelectorProps> = ({
  noteType,
  setNoteType,
}) => (
  <View className="flex-row mx-4 mt-4 mb-6 bg-gray-800 rounded-xl p-1">
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
);

export default NoteTypeSelector;
