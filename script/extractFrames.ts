import { FFmpegKit } from "ffmpeg-kit-react-native";
import { Platform } from "react-native";
import ReactNativeFS from "react-native-fs";
import { useVideoStore } from "@/store/useVideoStore";

const extractFrames = async (videoPath: string) => {
  const outputDir = `${ReactNativeFS.CachesDirectoryPath}/frames/`;

  await ReactNativeFS.unlink(outputDir).catch(() => {});
  await ReactNativeFS.mkdir(outputDir);

  const command = `-i "${videoPath}" -vf fps=1 "${outputDir}frame_%03d.jpg"`;
  await FFmpegKit.execute(command);

  const files = await ReactNativeFS.readDir(outputDir);
  const frames = files.map((file) =>
    Platform.OS === "android" ? `file://${file.path}` : file.path
  );

  useVideoStore.getState().setVideoResponse({
    video_url: videoPath,
    frame_count: frames.length,
    frames: frames,
  });

  return frames;
};

export default extractFrames;
