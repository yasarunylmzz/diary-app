import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

// Veritabanı dosya yolunu logla
const dbName = "video-diary.db";
let db: SQLite.SQLiteDatabase = null as any;

if (Platform.OS === "android") {
  // Android için dosya yolunu explicit tanımla
  const dbDir = `${FileSystem.documentDirectory}SQLite/`;
  const dbPath = `${dbDir}${dbName}`;

  (async () => {
    await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    db = SQLite.openDatabaseSync(dbPath);
    console.log("Android DB Path:", dbPath);
  })();
} else {
  // iOS için standart yol
  db = SQLite.openDatabaseSync(dbName);
  console.log(
    "iOS DB Path:",
    FileSystem.documentDirectory + "SQLite/" + dbName
  );
}

export default db;
