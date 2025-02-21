import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Video } from "expo-av";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import "nativewind";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FRAME_WIDTH = 60;
const TIMELINE_HEIGHT = 80;
const SELECTION_WIDTH = 5 * FRAME_WIDTH; // 5 seconds of frames

// Mock function to extract frames from video
const extractVideoFrames = async (videoUri, duration) => {
  // In a real implementation, you would extract actual frames from the video
  // This mock creates dummy frame URIs
  const framesCount = Math.ceil(duration);
  const frames = Array.from({ length: framesCount }, (_, i) => ({
    uri: videoUri, // In real implementation, these would be actual frame images
    timestamp: i,
  }));
  return frames;
};

// Simulate FFMPEG functionality
const trimVideo = async (videoUri, startTime, duration = 5) => {
  console.log(`Trimming video ${videoUri} from ${startTime}s for ${duration}s`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uri: videoUri,
        duration: duration,
        startTime: startTime,
      });
    }, 1000);
  });
};

const CreateVideoNote = () => {
  const [video, setVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [frames, setFrames] = useState([]);
  const [note, setNote] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);
  const timelineRef = useRef(null);

  // Animated values for the timeline
  const scrollPosition = useSharedValue(0);
  const selectionPosition = useSharedValue(0);

  // Calculate current trim start time
  const startTimeInSeconds =
    frames.length > 0
      ? (selectionPosition.value / (frames.length * FRAME_WIDTH)) *
        videoDuration
      : 0;

  // Video trimming mutation
  const trimMutation = useMutation({
    mutationFn: ({ videoUri, startTime }) => trimVideo(videoUri, startTime),
    onSuccess: (data) => {
      console.log("Video trimmed successfully:", data);
      setShowForm(true);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    },
  });

  // Load video frames when video changes
  useEffect(() => {
    if (video) {
      const loadFrames = async () => {
        const extractedFrames = await extractVideoFrames(
          video.uri,
          videoDuration
        );
        setFrames(extractedFrames);
      };
      loadFrames();
    }
  }, [video, videoDuration]);

  // Seek video when selection changes
  useEffect(() => {
    if (videoRef.current && startTimeInSeconds > 0) {
      videoRef.current.setPositionAsync(startTimeInSeconds * 1000);
    }
  }, [startTimeInSeconds]);

  // Animated styles for the selection window
  const selectionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: selectionPosition.value }],
    };
  });

  // Gesture for dragging the selection window
  const panGesture = Gesture.Pan()
    .onStart(() => {
      const startValue = selectionPosition.value;
      return { startValue };
    })
    .onUpdate((event, context) => {
      let newPosition = context.startValue + event.translationX;

      // Constrain position to valid range
      const maxPosition = frames.length * FRAME_WIDTH - SELECTION_WIDTH;
      if (newPosition < 0) newPosition = 0;
      if (newPosition > maxPosition) newPosition = maxPosition;

      selectionPosition.value = newPosition;

      // Ensure timeline scrolls along with selection if needed
      if (timelineRef.current) {
        const scrollTarget = Math.max(0, newPosition - SCREEN_WIDTH / 3);
        timelineRef.current.scrollTo({ x: scrollTarget, animated: false });
      }
    })
    .onEnd(() => {
      // Snap effect when released
      selectionPosition.value = withTiming(selectionPosition.value, {
        duration: 100,
      });
    });

  // Pick video from gallery
  const pickVideo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const selectedVideo = result.assets[0];
      setVideo(selectedVideo);

      // Set video duration (in a real app, extract from video metadata)
      const duration = 30; // Placeholder duration in seconds
      setVideoDuration(duration);

      // Reset position values
      selectionPosition.value = 0;
      scrollPosition.value = 0;

      setShowForm(false);
      setIsPlaying(false);
    }
  };

  // Toggle video playback
  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        // Seek to start time and play
        await videoRef.current.setPositionAsync(startTimeInSeconds * 1000);
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Process video with selected trim points
  const processTrimmedVideo = () => {
    if (!video) return;

    trimMutation.mutate({
      videoUri: video.uri,
      startTime: startTimeInSeconds,
    });
  };

  // Save note with video
  const saveVideoNote = () => {
    if (!note.name) {
      alert("Please provide a name for this video note");
      return;
    }

    // Save the note with trimmed video reference
    console.log("Saving video note:", {
      ...note,
      videoUri: video?.uri,
      trimStart: startTimeInSeconds,
      trimDuration: 5, // Fixed at 5 seconds
    });

    // Reset form
    setVideo(null);
    setFrames([]);
    setNote({ name: "", description: "" });
    setShowForm(false);
  };

  return (
    <View className="flex-1 p-4 bg-gray-900">
      {!video ? (
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-indigo-600 rounded-2xl mx-4 my-8 shadow-lg"
          onPress={pickVideo}
        >
          <FontAwesome name="video-camera" size={48} color="#fff" />
          <Text className="text-white text-xl font-bold mt-6">
            Select Video from Gallery
          </Text>
          <Text className="text-indigo-200 text-base mt-2 max-w-xs text-center">
            Choose a video to create your 5-second highlight clip
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-1">
          {/* Video Preview */}
          <View className="w-full aspect-video rounded-2xl overflow-hidden bg-black mb-4 shadow-lg">
            <Video
              ref={videoRef}
              source={{ uri: video.uri }}
              className="w-full h-full"
              useNativeControls={false}
              resizeMode="contain"
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setIsPlaying(false);
                }
              }}
            />

            {/* Playback Controls Overlay */}
            <TouchableOpacity
              className="absolute inset-0 items-center justify-center bg-black/30"
              onPress={togglePlayback}
            >
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                <FontAwesome
                  name={isPlaying ? "pause" : "play"}
                  size={30}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>

          {!showForm ? (
            <View className="bg-gray-800 rounded-2xl shadow-lg p-5">
              <Text className="text-lg font-semibold mb-2 text-white">
                Select 5-Second Clip
              </Text>
              <Text className="text-gray-300 mb-6">
                Start time: {startTimeInSeconds.toFixed(1)}s
              </Text>

              {/* Timeline with Frames */}
              <View className="mb-8">
                <View className="h-24 mb-1">
                  <ScrollView
                    ref={timelineRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={(e) => {
                      scrollPosition.value = e.nativeEvent.contentOffset.x;
                    }}
                    className="bg-gray-700 rounded-lg"
                  >
                    <View className="flex-row h-full">
                      {frames.map((frame, index) => (
                        <View
                          key={index}
                          className="border-r border-gray-600 items-center"
                          style={{ width: FRAME_WIDTH }}
                        >
                          <Image
                            source={{ uri: frame.uri }}
                            className="w-full h-full opacity-70"
                            style={{ width: FRAME_WIDTH }}
                          />
                          <Text className="absolute bottom-1 text-xs text-white/80">
                            {index}s
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Selection Window Overlay */}
                    <GestureDetector gesture={panGesture}>
                      <Animated.View
                        className="absolute top-0 bottom-0 border-2 border-indigo-500 bg-indigo-500/20"
                        style={[{ width: SELECTION_WIDTH }, selectionStyle]}
                      >
                        <View className="absolute inset-x-0 top-0 h-6 bg-indigo-600 rounded-t-md items-center justify-center">
                          <Text className="text-xs font-medium text-white">
                            5s Clip
                          </Text>
                        </View>

                        {/* Drag handles */}
                        <View className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1">
                          <Ionicons name="resize" size={16} color="#4338ca" />
                        </View>
                        <View className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1">
                          <Ionicons name="resize" size={16} color="#4338ca" />
                        </View>
                      </Animated.View>
                    </GestureDetector>
                  </ScrollView>
                </View>

                <Text className="text-xs text-gray-400 mb-4">
                  Drag the highlighted area to select your clip
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl bg-gray-700 items-center"
                  onPress={pickVideo}
                >
                  <Text className="text-white font-medium">Change Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl items-center ${
                    trimMutation.isPending ? "bg-indigo-400" : "bg-indigo-600"
                  }`}
                  onPress={processTrimmedVideo}
                  disabled={trimMutation.isPending}
                >
                  <Text className="text-white font-medium">
                    {trimMutation.isPending ? "Processing..." : "Trim Video"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="bg-gray-800 rounded-2xl shadow-lg p-5">
              <Text className="text-xl font-bold mb-6 text-white">
                Add Details
              </Text>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-300 mb-2 font-medium">Title</Text>
                  <TextInput
                    className="bg-gray-700 p-4 rounded-xl mb-1 text-base text-white"
                    placeholder="Video Note Title"
                    placeholderTextColor="#9ca3af"
                    value={note.name}
                    onChangeText={(text) => setNote({ ...note, name: text })}
                  />
                </View>

                <View>
                  <Text className="text-gray-300 mb-2 font-medium">
                    Description
                  </Text>
                  <TextInput
                    className="bg-gray-700 p-4 rounded-xl mb-1 text-base min-h-28 text-white"
                    placeholder="Description (optional)"
                    placeholderTextColor="#9ca3af"
                    value={note.description}
                    onChangeText={(text) =>
                      setNote({ ...note, description: text })
                    }
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View className="flex-row space-x-3 mt-6">
                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl bg-gray-700 items-center"
                  onPress={() => setShowForm(false)}
                >
                  <Text className="text-white font-medium">Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl bg-indigo-600 items-center"
                  onPress={saveVideoNote}
                >
                  <Text className="text-white font-medium">
                    Save Video Note
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CreateVideoNote;
