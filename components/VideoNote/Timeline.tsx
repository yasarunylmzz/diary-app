import React, { useRef, useEffect } from "react";
import { ScrollView, View, Image, Text, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { TimelineProps } from "@/types/timeline";

const SCREEN_WIDTH = Dimensions.get("window").width;
const FRAME_WIDTH = 60;
const SELECTION_WIDTH = 5 * FRAME_WIDTH;

const Timeline: React.FC<TimelineProps> = ({
  frames,
  onUpdateSelection,
  videoDuration,
  initialPosition = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectionPosition = useSharedValue(initialPosition);

  useEffect(() => {
    if (scrollViewRef.current && initialPosition > 0) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, initialPosition - SCREEN_WIDTH / 3),
        animated: true,
      });
    }
  }, [initialPosition]);

  const handleSelectionUpdate = (position: number) => {
    onUpdateSelection(position);
  };

  const selectionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectionPosition.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate(({ translationX }) => {
      const maxPosition = Math.max(
        0,
        frames.length * FRAME_WIDTH - SELECTION_WIDTH
      );
      selectionPosition.value = Math.max(
        0,
        Math.min(selectionPosition.value + translationX, maxPosition)
      );
      runOnJS(handleSelectionUpdate)(selectionPosition.value);
    })
    .onEnd(() => {
      selectionPosition.value = withTiming(selectionPosition.value, {
        duration: 100,
      });
    });

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(
      2,
      "0"
    )}`;

  const getFrameTime = (index: number) =>
    (index / frames.length) * videoDuration;

  return (
    <View className="mb-2 p-4">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-gray-700 rounded-lg overflow-hidden"
      >
        <View className="flex-row h-24">
          {frames.map((frame, index) => (
            <View
              key={index}
              className="border-r border-gray-600/30 relative"
              style={{ width: FRAME_WIDTH }}
            >
              <Image
                source={{ uri: frame.uri }}
                className="w-full h-full opacity-80"
              />
              {index % 5 === 0 && (
                <View className="absolute bottom-1 bg-black/70 px-1 rounded-sm">
                  <Text className="text-xs text-white font-medium">
                    {formatTime(getFrameTime(index))}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute top-0 bottom-0 border-2 border-indigo-500 bg-indigo-500/20"
            style={[{ width: SELECTION_WIDTH }, selectionStyle]}
          >
            <View className="absolute inset-x-0 top-0 h-6 bg-indigo-600 rounded-t-md items-center justify-center">
              <Text className="text-xs font-medium text-white">5s Clip</Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </ScrollView>

      <View className="flex-row items-center justify-center mt-2 space-x-2 ">
        <Ionicons name="hand-left-outline" size={14} color="#9ca3af" />
        <Text className="text-xs text-gray-400">
          Drag to select your 5-second clip
        </Text>
      </View>
    </View>
  );
};

export default Timeline;
