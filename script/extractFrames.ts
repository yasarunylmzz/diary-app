import { FFmpegKit, FFprobeKit } from "ffmpeg-kit-react-native";
import RNFS from "react-native-fs";

export const extractFrames = async (videoPath: string) => {
  const videoDir = videoPath.substring(0, videoPath.lastIndexOf("/"));
  const outputDir = `${videoDir}/frames`;
  await RNFS.mkdir(outputDir);

  try {
    // 1. Video süresini al (FFprobe ile)
    const probeCommand = `-v error -show_entries format=duration -of json "${videoPath}"`;
    const probeSession = await FFprobeKit.execute(probeCommand);
    const probeOutput = await probeSession.getOutput();

    if (!probeOutput) throw new Error("Video süresi alınamadı");
    const duration = Math.floor(JSON.parse(probeOutput).format.duration);

    // 2. Her saniye için bir kare al (Zaman bazlı seçim)
    const command = `-i "${videoPath}" -vf "select='isnan(prev_selected_t)+gte(t,prev_selected_t+1)',setpts=N/(25*TB)" -vsync 0 "${outputDir}/frame_%03d.png"`;

    console.log("Çalıştırılan Komut:", command);

    // 3. FFmpeg'i çalıştır
    await FFmpegKit.execute(command);

    // 4. Oluşan kare sayısını kontrol et
    const files = await RNFS.readDir(outputDir);
    if (files.length !== duration) {
      console.warn(`Beklenen: ${duration} kare, Oluşan: ${files.length} kare`);
    }

    return files;
  } catch (error) {
    console.error("Son hata:", error);
    throw error;
  }
};
