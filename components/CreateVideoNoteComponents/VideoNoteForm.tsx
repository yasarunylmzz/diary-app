import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const VideoNoteForm = ({ onSave }: any) => {
  const [note, setNote] = useState({ name: "", description: "" });
  const [isFocused, setIsFocused] = useState({
    name: false,
    description: false,
  });
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const buttonScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.03, 1],
  });

  const renderCharacterCount = (text: any, maxCount = 100) => {
    const count = text?.length || 0;
    const color =
      count > maxCount * 0.8
        ? count > maxCount
          ? "#ef4444"
          : "#f59e0b"
        : "#9ca3af";

    return (
      <Text style={{ color, fontSize: 10 }} className="text-right mt-1">
        {count}/{maxCount}
      </Text>
    );
  };

  return (
    <View className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-1 mx-2 my-4">
      <View className="flex-row items-center justify-between mb-7">
        <View className="flex-row items-center">
          <View className=" rounded-full bg-blue-600 p-4 mr-3">
            <FontAwesome name="pencil" size={20} color="#ffffff" />
          </View>
          <Text className="text-white text-xl font-bold tracking-wide">
            Video Notları
          </Text>
        </View>

        <View className="flex-row">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
          <View className="w-2 h-2 rounded-full bg-indigo-500 mr-1" />
          <View className="w-2 h-2 rounded-full bg-purple-500" />
        </View>
      </View>

      <View
        className={`bg-gray-800/40 backdrop-blur-lg rounded-2xl p-5 mb-5 ${
          isFocused.name ? "border border-blue-500/50" : ""
        }`}
      >
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

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl py-4 items-center shadow-lg mb-3"
          onPress={() => onSave(note)}
          style={{
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="save"
              size={18}
              color="#ffffff"
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg">Notu Kaydet</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View className="bg-gray-800/30 rounded-xl p-3 mt-2">
        <View className="flex-row items-center justify-center">
          <FontAwesome
            name="info-circle"
            size={12}
            color="#9ca3af"
            className="mr-2"
          />
          <Text className="text-gray-400 text-xs">
            Kaydettiğiniz not video veri tabanına eklenecektir
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VideoNoteForm;
