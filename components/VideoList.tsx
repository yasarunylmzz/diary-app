import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VideoCard from "./VideoCard";

export default function VideoList() {
  // Örnek video verileri
  const videos = [
    {
      id: "1",
      title: "Günlük Video #1",
      description:
        "Bugün harika bir gündü! Sabah erkenden kalkıp sahilde yürüyüş yaptım...",
      videoUri:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Expo örnek video
      duration: "5",
      createdAt: "12 Mart 2024",
    },
    {
      id: "2",
      title: "Akşam Düşünceleri",
      description:
        "Bu akşam yeni projemi planladım ve bazı önemli kararlar aldım...",
      videoUri:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Expo örnek video
      duration: "4",
      createdAt: "11 Mart 2024",
    },
  ];

  // Boş durum kontrolü
  if (videos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="videocam-outline" size={32} color="#9CA3AF" />
        </View>
        <Text className="text-gray-500 text-lg font-medium">
          Henüz video yok
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          Yeni video eklemek için + butonuna dokun
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          description={video.description}
          videoUri={video.videoUri}
          duration={video.duration}
          createdAt={video.createdAt}
          onPress={() => {
            // Video detay sayfasına yönlendirme
            console.log(`Video ${video.id} tıklandı`);
          }}
        />
      ))}
    </View>
  );
}
