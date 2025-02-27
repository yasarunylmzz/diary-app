// databaseSetup.ts
import db, { getDatabase, VideoEntry, TagEntry, TextNoteEntry } from "./db";
import * as FileSystem from "expo-file-system";

interface QueryResult {
  success: boolean;
  error?: string;
  data?: any;
  video?: VideoEntry;
  tags?: TagEntry[];
  notes?: TextNoteEntry[];
}

export const setupDatabase = async (): Promise<QueryResult> => {
  try {
    const db = await getDatabase();

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        description TEXT, 
        filePath TEXT NOT NULL,
        startTime REAL NOT NULL,
        endTime REAL NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        videoId INTEGER,
        name TEXT NOT NULL,
        FOREIGN KEY(videoId) REFERENCES videos(id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS textnotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        videoId INTEGER,
        title TEXT NOT NULL, 
        description TEXT, 
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(videoId) REFERENCES videos(id)
      );
    `);

    console.log("Database initialized successfully.");
    return { success: true };
  } catch (error) {
    console.error(
      "Error initializing database:",
      error instanceof Error ? error.message : String(error)
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const createVideoNotes = async (video: VideoEntry): Promise<QueryResult> => {
  try {
    const db = await getDatabase();

    console.log("Using database at:", db.databasePath);

    await db.runAsync(
      `INSERT INTO videos (name, description, filePath, startTime, endTime)
      VALUES (?, ?, ?, ?, ?);`,
      [
        video.name,
        video.description,
        video.filePath,
        video.startTime,
        video.endTime,
      ]
    );

    console.log("Video added successfully.");
    return { success: true };
  } catch (error) {
    console.error(
      "Error adding video:",
      error instanceof Error ? error.message : String(error)
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const getVideoNotes = async (): Promise<
  QueryResult & { data?: VideoEntry[] }
> => {
  try {
    const db = await getDatabase();

    const result = await db.getAllAsync<VideoEntry>(`
      SELECT 
        id,
        name,
        description,
        filePath,
        startTime,
        endTime,
        createdAt 
      FROM videos
      ORDER BY createdAt DESC;
    `);

    if (!result || result.length === 0) {
      return {
        success: false,
        error: "No videos found",
        data: [],
      };
    }

    console.log(`Retrieved ${result.length} videos`);
    return {
      success: true,
      data: result.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        filePath: row.filePath,
        startTime: row.startTime,
        endTime: row.endTime,
        createdAt: row.createdAt,
      })),
    };
  } catch (error) {
    console.error(
      "Error fetching videos:",
      error instanceof Error ? error.message : String(error)
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      data: [],
    };
  }
};

export default createVideoNotes;
