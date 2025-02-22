import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VideoCard from "./VideoCard";

export default function VideoList() {
  const videos = [
    {
      id: "1",
      title: "Günlük Video #1",
      description:
        "Bugün harika bir gündü! Sabah erkenden kalkıp sahilde yürüyüş yaptım...",
      videoUri:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: "5",
      createdAt: "12 Mart 2024",
    },
    {
      id: "2",
      title: "Akşam Düşünceleri",
      description:
        "Bu akşam yeni projemi planladım ve bazı önemli kararlar aldım...",
      videoUri:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: "4",
      createdAt: "11 Mart 2024",
    },
  ];

  if (videos.length === 0) {
    return (
      <View className="p-4">
        <View className="mt-6 items-center">
          <Ionicons name="videocam-outline" size={40} color="#4b5563" />
          <Text className="text-center text-gray-500 mt-2 text-sm px-8">
            Henüz video eklemediniz, alttaki butondan ilk anınızı kaydedin!
          </Text>
        </View>
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
            console.log(`Video ${video.id} tıklandı`);
          }}
        />
      ))}
    </View>
  );
}
