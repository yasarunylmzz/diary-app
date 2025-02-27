// db.ts
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

const dbName = "video-diary.db";
let db: SQLite.SQLiteDatabase | null = null;

export interface VideoEntry {
  id?: number;
  name: string;
  description: string;
  filePath: string;
  startTime: number;
  endTime: number;
  createdAt?: string;
}

export interface TagEntry {
  id?: number;
  videoId: number;
  name: string;
}

export interface TextNoteEntry {
  id?: number;
  videoId: number;
  title: string;
  description?: string;
  createdAt?: string;
}

export const initializeDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  try {
    if (Platform.OS === "android") {
      const dbDir = `SQLite`;

      const dirPath = `${FileSystem.documentDirectory}${dbDir}`;
      await FileSystem.makeDirectoryAsync(dirPath, {
        intermediates: true,
      }).catch(() => console.log("Directory already exists"));

      db = SQLite.openDatabaseSync(dbName);
    } else {
      db = SQLite.openDatabaseSync(dbName);
    }

    await db.execAsync("SELECT 1");
    console.log("Database connection test succeeded", db.databasePath);
    return db;
  } catch (error) {
    console.error("Database connection test failed:", error);
    throw error;
  }
};

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db === null) {
    return initializeDb();
  }
  return db;
};

const database = initializeDb();

export default database;
