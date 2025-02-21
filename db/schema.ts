import db from "./db";

export const setupDatabase = async () => {
  try {
    // Tabloyu oluştur
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        description TEXT, 
        filePath TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Veritabanı yolunu PRAGMA ile al
    const result = await db.getAllAsync(
      "SELECT file FROM pragma_database_list WHERE name = 'main';"
    );

    if (result.length > 0) {
      console.log("Database file location:", result[0].file);
    }

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
