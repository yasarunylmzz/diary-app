import React, { useRef, useEffect } from "react";
import { ScrollView, View, Image, Dimensions, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useVideoStore } from "@/store/useVideoStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const FRAME_WIDTH = 32;
const GAP = 1;
const SELECTION_WIDTH = 5 * FRAME_WIDTH;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const Timeline: React.FC<{
  onUpdateSelection: (position: number) => void;
  initialPosition?: number;
  videoDuration: number;
}> = ({ onUpdateSelection, initialPosition = 0, videoDuration }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectionPosition = useSharedValue(initialPosition * FRAME_WIDTH);
  const videoStore = useVideoStore();
  const frames = videoStore.videoResponse?.frames || [];
  const startX = useSharedValue(0);

  useEffect(() => {
    if (scrollViewRef.current && initialPosition > 0) {
      const initialPositionPixels = initialPosition * FRAME_WIDTH;
      scrollViewRef.current.scrollTo({
        x: Math.max(0, initialPositionPixels - SCREEN_WIDTH / 3),
        animated: true,
      });
    }
  }, [initialPosition]);

  const { videoResponse, setSelectedTimeRange } = useVideoStore();

  const handleSelectionUpdate = (positionPixels: number) => {
    const start = Math.round(positionPixels / FRAME_WIDTH);
    const end = Math.min(start + 5, videoResponse?.frame_count || 0);

    setSelectedTimeRange(start, end);

    console.log("Seçilen Aralık:", {
      start: formatTime(start),
      end: formatTime(end),
      startSeconds: start,
      endSeconds: end,
    });
  };

  const selectionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectionPosition.value }],
  }));

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = selectionPosition.value;
    })
    .onUpdate(({ translationX }) => {
      const newPosition = startX.value + translationX;
      const maxPosition = Math.max(0, (frames.length - 5) * FRAME_WIDTH);
      const clampedPosition = Math.max(0, Math.min(newPosition, maxPosition));
      selectionPosition.value = clampedPosition;
      runOnJS(handleSelectionUpdate)(clampedPosition);
    })
    .onEnd(() => {
      const currentPosition = selectionPosition.value;
      const snappedPosition =
        Math.round(currentPosition / FRAME_WIDTH) * FRAME_WIDTH;
      const maxPosition = Math.max(0, (frames.length - 5) * FRAME_WIDTH);
      const clampedSnappedPosition = Math.max(
        0,
        Math.min(snappedPosition, maxPosition)
      );
      selectionPosition.value = withTiming(clampedSnappedPosition, {
        duration: 100,
      });
      runOnJS(handleSelectionUpdate)(clampedSnappedPosition);
    });

  return (
    <View className="mb-4 px-4 space-y-3">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row relative pb-2" style={{ gap: GAP }}>
          {frames.map((frame, index) => (
            <View
              key={index}
              className="bg-gray-800 rounded-sm overflow-hidden"
              style={{ width: FRAME_WIDTH - GAP, height: 80 }}
            >
              <Image
                source={{ uri: frame }}
                className="w-full h-full opacity-90"
              />
              {index % 5 === 0 && (
                <Text className="absolute bottom-[-18px] left-[-2px] text-gray-400 text-xs font-medium">
                  {formatTime(index)}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View
          className="absolute bottom-0 left-0 flex-row"
          style={{ gap: GAP }}
        >
          {frames.map((_, index) => (
            <View
              key={`marker-${index}`}
              className={[
                "bg-gray-600",
                index % 5 === 0 ? "h-4 border-l border-gray-500" : "h-2 mt-2",
              ].join(" ")}
              style={{ width: FRAME_WIDTH - GAP }}
            />
          ))}
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute top-0 bottom-0 border-2 border-indigo-400 bg-indigo-400/10 rounded-lg"
            style={[
              selectionStyle,
              {
                width: SELECTION_WIDTH,
                shadowColor: "#6366f1",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
          >
            <View className="absolute top-0 left-0 right-0 flex-row items-center justify-center h-6 bg-indigo-500 rounded-t-lg space-x-1">
              <Ionicons name="time-outline" size={14} color="white" />
              <Text className="text-white text-xs font-semibold">5s</Text>
            </View>
            <View className="absolute bottom-[-6px] left-0 right-0 items-center">
              <View className="w-8 h-1.5 bg-indigo-400 rounded-full" />
            </View>
          </Animated.View>
        </GestureDetector>
      </ScrollView>

      <View className="flex-row items-center justify-center space-x-2">
        <Ionicons name="hand-left-outline" size={16} color="#71717a" />
        <Text className="text-gray-400 text-sm">
          Sürükleyerek 5 saniyelik bölüm seçin
        </Text>
      </View>
    </View>
  );
};

export default Timeline;
