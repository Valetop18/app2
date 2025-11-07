import * as SQLite from 'expo-sqlite';

export const init = async () => {
  const db = await SQLite.openDatabaseAsync("distritoSelect.db");
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS distritoSelect (
        id INTEGER PRIMARY KEY NOT NULL,
        distrito INT NOT NULL,
        region INT NOT NULL
      );
    `);
  };

  export const insertDistrito = async (distrito, region) => {
    const db = await SQLite.openDatabaseAsync("distritoSelect.db");
    
      await db.runAsync(
        `INSERT INTO distritoSelect (distrito, region) VALUES (?, ?)`,
        [distrito, region]
      );
    };
