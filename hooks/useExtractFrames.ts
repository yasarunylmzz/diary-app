import { useMutation } from "@tanstack/react-query";
import { extractFrames, ReadDirItem } from "@/script/extractFrames";

export const useExtractFrames = () => {
  return useMutation({
    mutationFn: async (videoPath: string): Promise<ReadDirItem[]> => {
      return await extractFrames(videoPath);
    },
  });
};
