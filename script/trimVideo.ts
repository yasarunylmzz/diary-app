// trimVideo.ts
import { useVideoStore } from "@/store/useVideoStore";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import RNFS from "react-native-fs";

export const trimVideo = async () => {
  const { videoResponse, selectedStartTime, selectedEndTime } =
    useVideoStore.getState();

  if (!videoResponse?.video_url) {
    throw new Error("Kaynak video bulunamadı");
  }

  const inputExists = await RNFS.exists(videoResponse.video_url);
  if (!inputExists) throw new Error("Orijinal video dosyası mevcut değil");

  const outputPath = `${RNFS.CachesDirectoryPath}/trimmed_${Date.now()}.mp4`;

  const command = `
    -ss ${selectedStartTime} 
    -i "${videoResponse.video_url}" 
    -to ${selectedEndTime} 
    -c copy 
    -y 
    ${outputPath}
  `
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ");

  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (returnCode.getValue() !== 0) {
      throw new Error(`FFmpeg hatası (${returnCode.getValue()})`);
    }

    const fileInfo = await RNFS.stat(outputPath);
    if (fileInfo.size < 1024) {
      throw new Error("Geçersiz video boyutu");
    }

    return outputPath;
  } catch (error) {
    await RNFS.unlink(outputPath).catch(() => {});

    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    throw new Error(`Video kırpma hatası: ${message}`);
  }
};
