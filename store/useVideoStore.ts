import { create } from "zustand";

interface VideoResponse {
  frame_count: number;
  frames: string[];
  video_url: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  videoUri?: string;
  createdAt: string;
  duration: number;
}

interface VideoStore {
  videoResponse: VideoResponse | null;
  selectedStartTime: number;
  selectedEndTime: number;
  setVideoResponse: (response: VideoResponse) => void;
  setSelectedTimeRange: (start: number, end: number) => void;
  clearVideoResponse: () => void;
  videos: Video[];
  selectedVideoId: string | null;
  setVideos: (videos: Video[]) => void;
  setSelectedVideoId: (id: string | null) => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  selectedVideoId: null,
  setVideos: (videos) => set({ videos }),
  setSelectedVideoId: (id) => set({ selectedVideoId: id }),
  videoResponse: null,
  selectedStartTime: 0,
  selectedEndTime: 5,

  setVideoResponse: (response) => {
    set({ videoResponse: response });
  },

  setSelectedTimeRange: (start, end) => {
    const maxDuration = get().videoResponse?.frame_count || 0;
    set({
      selectedStartTime: Math.max(0, start),
      selectedEndTime: Math.min(end, maxDuration),
    });
  },

  clearVideoResponse: () => {
    set({ videoResponse: null });
  },
}));
