import { create } from "zustand";
import { VideoNote } from "@/types/diary"; // Eğer tipi ayrı bir dosyada tutuyorsan

type VideoStore = {
  video: VideoNote | null;
  showPoster: boolean;
  setVideo: (video: VideoNote) => void;
  setShowPoster: (show: boolean) => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  video: null,
  showPoster: false,
  setVideo: (video) => set({ video }),
  setShowPoster: (show) => set({ showPoster: show }),
}));
