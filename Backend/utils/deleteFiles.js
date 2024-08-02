import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get __filename and __dirname equivalents in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust the base directory to the project root's public/uploads folder
const baseDir = path.join(__dirname, "../public/uploads");

// Function to delete files with enhanced logging and existence check
const deleteFiles = async (files) => {
  try {
    const deletePromises = files.map(async (file) => {
      const filePath = path.join(baseDir, file);
      console.log(`Checking existence of: ${filePath}`);
      try {
        await fs.access(filePath);
        console.log(`Deleting file: ${filePath}`);
        await fs.unlink(filePath);
      } catch {
        console.log(`File not found, skipping: ${filePath}`);
      }
    });
    await Promise.all(deletePromises);
    console.log("Files deletion process completed");
  } catch (err) {
    console.error("Error deleting files:", err);
  }
};

export { deleteFiles };
