import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function TabTwoScreen() {
  const notes = [
    {
      id: 1,
      title: "Alışveriş Listesi",
      content: "Süt, yumurta, ekmek, meyve...",
      date: "15 Mar 2024",
      tags: ["alışveriş", "acil"],
    },
    {
      id: 2,
      title: "Kitap Önerileri",
      content: "1984 - George Orwell, Sapiens - Yuval Noah Harari...",
      date: "14 Mar 2024",
      tags: ["okuma", "liste"],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="px-6 pt-4 pb-6 bg-gray-900">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-extrabold text-gray-100">
              Notlarım
            </Text>
            <Text className="text-base text-gray-400 mt-1">
              {notes.length} kayıtlı not
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {notes.length > 0 ? (
          notes.map((note) => (
            <View
              key={note.id}
              className="bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg shadow-black/40"
            >
              <Text className="text-lg font-bold text-gray-100 mb-1">
                {note.title}
              </Text>
              <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                {note.content}
              </Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-row flex-wrap">
                  {note.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-gray-700 px-3 py-1 rounded-full mr-2 mb-1"
                    >
                      <Text className="text-gray-300 text-xs">#{tag}</Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center bg-indigo-900/30 px-3 py-1 rounded-full">
                  <Ionicons name="calendar-outline" size={14} color="#818CF8" />
                  <Text className="text-indigo-400 text-xs ml-1">
                    {note.date}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center justify-center mt-20">
            <Ionicons name="document-text-outline" size={64} color="#4B5563" />
            <Text className="text-gray-500 text-lg mt-4 font-medium">
              Henüz not eklemediniz
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
