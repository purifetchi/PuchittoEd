import { dialog } from "electron"
import { readFile } from "node:fs/promises";

export const openFilePicker = async (_) => {
  try {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] })
    const data = await readFile(result.filePaths[0])
    return data
  } catch (error) {
    console.error("[main:openFilePicker] File read error:", error);
    throw error
  }
}
