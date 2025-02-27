import { VideoView, useVideoPlayer } from "expo-video";
import { View } from "react-native";

const VideoPlayer = ({ videoUri }: { videoUri: string }) => {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="w-full h-full aspect-video rounded-2xl overflow-hidden mb-4 shadow-xl">
      {player && (
        <VideoView
          player={player}
          allowsFullscreen
          style={{ width: "100%", height: "100%" }}
          allowsPictureInPicture
        />
      )}
    </View>
  );
};

export default VideoPlayer;
