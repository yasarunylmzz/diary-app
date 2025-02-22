import { View, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const VideoPicker = ({ onVideoPicked, onClose }: any) => {
  const pickVideo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      onVideoPicked(result.assets[0]);
    }
  };
  return (
    <View className="w-full p-6 bg-white rounded-2xl shadow-xl shadow-blue-900/20">
      <View className="items-center mb-6">
        <View className="w-20 h-20 bg-indigo-100 rounded-2xl items-center justify-center mb-4">
          <FontAwesome
            name="video-camera"
            size={32}
            color="#4f46e5"
            style={{ transform: [{ rotate: "-15deg" }] }}
          />
        </View>

        <Text className="text-2xl font-extrabold text-gray-900 mb-2">
          Video Yükle
        </Text>
        <Text className="text-center text-gray-500 text-base px-4 mb-6">
          5 saniyeyi geçmeyen mükemmel anınızı seçin
        </Text>
      </View>

      <TouchableOpacity
        onPress={pickVideo}
        className="flex-row items-center justify-center bg-indigo-600 py-4 gap-2 px-6 rounded-xl space-x-3 
        active:bg-indigo-700 border-2 border-indigo-700"
        activeOpacity={0.8}
      >
        <FontAwesome name="photo" size={20} color="white" />
        <Text className="text-white font-bold text-lg">Galeriden Seç</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8 gap-2 space-x-2">
        {[1, 2, 3].map((item) => (
          <View key={item} className="w-2 h-2 rounded-full bg-indigo-400" />
        ))}
      </View>
    </View>
  );
};

export default VideoPicker;
