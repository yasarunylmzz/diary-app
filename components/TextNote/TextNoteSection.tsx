import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { FC, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const TextNoteSection: FC = () => {
  const [note, setNote] = useState({
    name: "",
    description: "",
  });
  const [isFocused, setIsFocused] = useState({
    name: false,
    description: false,
  });

  const renderCharacterCount = (text: string, maxLength: number) => (
    <Text
      className={`text-xs mt-1 mr-1 ${
        text.length > maxLength ? "text-red-400" : "text-gray-400"
      }`}
    >
      {text.length}/{maxLength}
    </Text>
  );

  return (
    <View className="flex-1">
      <Text className="text-gray-100 text-lg font-semibold mb-4">
        Yeni Metin Notu
      </Text>

      {/* Başlık Bölümü */}
      <View className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-5 mb-7">
        <View className="flex-row items-center justify-between">
          <Text className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">
            Not Başlığı
          </Text>
          <FontAwesome name="header" size={12} color="#60a5fa" />
        </View>

        <TextInput
          className="text-white text-lg pb-2"
          placeholder="Video için etkileyici bir başlık girin"
          placeholderTextColor="#6b7280"
          value={note.name}
          onChangeText={(text) => setNote({ ...note, name: text })}
          onFocus={() => setIsFocused({ ...isFocused, name: true })}
          onBlur={() => setIsFocused({ ...isFocused, name: false })}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: isFocused.name
              ? "rgba(96, 165, 250, 0.7)"
              : "rgba(96, 165, 250, 0.3)",
          }}
        />
        {renderCharacterCount(note.name, 50)}
      </View>

      {/* Açıklama Bölümü */}
      <View
        className={`bg-gray-800/40 backdrop-blur-lg rounded-2xl p-5 mb-7 ${
          isFocused.description ? "border border-blue-500/50" : ""
        }`}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">
            Açıklama
          </Text>
          <FontAwesome name="align-left" size={14} color="#60a5fa" />
        </View>

        <TextInput
          className="text-white text-lg pb-2"
          placeholder="Detaylı açıklama girin..."
          placeholderTextColor="#6b7280"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          value={note.description}
          onChangeText={(text) => setNote({ ...note, description: text })}
          onFocus={() => setIsFocused({ ...isFocused, description: true })}
          onBlur={() => setIsFocused({ ...isFocused, description: false })}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: isFocused.description
              ? "rgba(96, 165, 250, 0.7)"
              : "rgba(96, 165, 250, 0.3)",
            minHeight: 100,
          }}
        />
        {renderCharacterCount(note.description, 500)}
      </View>

      {/* Alt Butonlar */}
      <View className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-5">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity className="flex-row items-center bg-gray-700 px-4 py-2 rounded-full">
            <Ionicons name="pricetag-outline" size={18} color="#818CF8" />
            <Text className="text-gray-300 ml-2">Etiket Ekle</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row px-6 py-3 border border-white rounded-full">
            <FontAwesome name="save" size={18} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Notu Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bilgilendirme */}
      <View className="flex-row bg-gray-800/30 items-center justify-center rounded-xl p-3 mt-7">
        <FontAwesome name="info-circle" size={12} color="#9ca3af" />
        <Text className="text-gray-400 text-center text-xs ml-2">
          Kaydettiğiniz not video veri tabanına eklenecektir
        </Text>
      </View>
    </View>
  );
};

export default TextNoteSection;
