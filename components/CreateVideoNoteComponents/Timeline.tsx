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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FRAME_WIDTH = 60;
const SELECTION_WIDTH = 5 * FRAME_WIDTH;

interface Frame {
  uri: string;
  timestamp: number;
}

interface TimelineProps {
  frames: Frame[];
  onUpdateSelection: (position: number) => void;
  videoDuration: number;
  initialPosition?: number;
}

const Timeline: React.FC<TimelineProps> = ({
  frames,
  onUpdateSelection,
  videoDuration,
  initialPosition = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectionPosition = useSharedValue(initialPosition);

  // Update external components when selection changes
  const handleSelectionUpdate = (position: number) => {
    onUpdateSelection(position);
  };

  // Animated style for selection window
  const selectionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectionPosition.value }],
  }));

  // Auto-scroll to keep selection in view
  useEffect(() => {
    if (scrollViewRef.current && initialPosition > 0) {
      const scrollTarget = Math.max(0, initialPosition - SCREEN_WIDTH / 3);
      scrollViewRef.current.scrollTo({ x: scrollTarget, animated: true });
    }
  }, [initialPosition]);

  // Pan gesture handler for selection window
  const panGesture = Gesture.Pan()
    .onStart(() => {
      const startValue = selectionPosition.value;
      return { startValue };
    })
    .onUpdate((event, context) => {
      let newPosition = context.startValue + event.translationX;

      // Constrain position to valid range
      const maxPosition = Math.max(
        0,
        frames.length * FRAME_WIDTH - SELECTION_WIDTH
      );
      newPosition = Math.max(0, Math.min(newPosition, maxPosition));

      selectionPosition.value = newPosition;
      runOnJS(handleSelectionUpdate)(newPosition);

      // Auto-scroll when dragging near edges
      if (scrollViewRef.current) {
        const currentPosition = newPosition;
        const visibleAreaStart =
          scrollViewRef.current.getScrollableNode().contentOffset?.x || 0;
        const visibleAreaEnd = visibleAreaStart + SCREEN_WIDTH;

        // Auto-scroll if selection approaches edge of visible area
        if (currentPosition < visibleAreaStart + 100) {
          scrollViewRef.current.scrollTo({
            x: Math.max(0, currentPosition - 150),
            animated: false,
          });
        } else if (currentPosition + SELECTION_WIDTH > visibleAreaEnd - 100) {
          scrollViewRef.current.scrollTo({
            x: currentPosition - SCREEN_WIDTH + SELECTION_WIDTH + 150,
            animated: false,
          });
        }
      }
    })
    .onEnd(() => {
      // Snap effect when released
      selectionPosition.value = withTiming(selectionPosition.value, {
        duration: 100,
      });
    });

  // Calculate time display for a frame
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Calculate actual time for a frame index
  const getFrameTime = (index: number) => {
    return (index / frames.length) * videoDuration;
  };

  // Only show time labels on certain frames to avoid clutter
  const shouldShowTimeLabel = (index: number) => {
    return index % 5 === 0 || index === frames.length - 1;
  };

  return (
    <View className="mb-2 p-4">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        className="bg-gray-700 rounded-lg overflow-hidden"
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {/* Background grid for timeline */}
        <View className="absolute top-0 bottom-0 left-0 right-0">
          {Array.from({ length: Math.ceil(frames.length / 5) }).map((_, i) => (
            <View
              key={`grid-${i}`}
              className="absolute h-full w-px bg-gray-600/50"
              style={{ left: i * 5 * FRAME_WIDTH }}
            />
          ))}
        </View>

        {/* Frames Row */}
        <View className="flex-row h-24">
          {frames.map((frame, index) => (
            <View
              key={index}
              className="border-r border-gray-600/30 items-center relative"
              style={{ width: FRAME_WIDTH }}
            >
              <Image
                source={{ uri: frame.uri }}
                className="w-full h-full opacity-80"
                style={{ width: FRAME_WIDTH }}
              />
              {shouldShowTimeLabel(index) && (
                <View className="absolute bottom-1 bg-black/70 px-1 rounded-sm">
                  <Text className="text-xs text-white font-medium">
                    {formatTime(getFrameTime(index))}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Selection Window Overlay */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute top-0 bottom-0 border-2 border-indigo-500 bg-indigo-500/20"
            style={[{ width: SELECTION_WIDTH }, selectionStyle]}
          >
            {/* Selection Header */}
            <View className="absolute inset-x-0 top-0 h-6 bg-indigo-600 rounded-t-md items-center justify-center">
              <Text className="text-xs font-medium text-white">5s Clip</Text>
            </View>

            {/* Time indicator */}
            <View className="absolute bottom-1 left-2 right-2 bg-black/60 rounded px-1 py-0.5 items-center">
              <Text className="text-xs text-white">
                {formatTime(
                  (selectionPosition.value / (frames.length * FRAME_WIDTH)) *
                    videoDuration
                )}
              </Text>
            </View>

            {/* Drag handles */}
            <View className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow">
              <Ionicons name="resize" size={14} color="#4338ca" />
            </View>
            <View className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow">
              <Ionicons name="resize" size={14} color="#4338ca" />
            </View>

            {/* Selection border effects */}
            <View className="absolute inset-y-0 left-0 w-1 bg-indigo-500 opacity-80" />
            <View className="absolute inset-y-0 right-0 w-1 bg-indigo-500 opacity-80" />
          </Animated.View>
        </GestureDetector>
      </ScrollView>

      {/* Instructions */}
      <View className="flex-row items-center justify-center mt-4 space-x-2 ">
        <Ionicons name="hand-left-outline" size={14} color="#9ca3af" />
        <Text className="text-xs text-gray-400">
          Drag the highlighted area to select your 5-second clip
        </Text>
      </View>
    </View>
  );
};

export default Timeline;
