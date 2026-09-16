import type { Dirent, Stats } from 'fs'
import path from 'path'
import type { Asset } from '../../preload/editor/assetOps'

/**
 * Converts an absolute project entry path to the canonical path sent over IPC.
 * @param parent The project root.
 * @param fullPath The absolute path to the entry.
 */
export const toAssetPath = (parent: string, fullPath: string): string => {
  const relativePath = path.relative(parent, fullPath).replaceAll('\\', '/')
  return `/${relativePath}`
}

/**
 * Converts a dirent to an asset.
 * @param parent The parent path.
 * @param dirent The dirent.
 */
export const direntToAsset = (parent: string, dirent: Dirent<string>): Asset => {
  return {
    path: toAssetPath(parent, path.join(dirent.parentPath, dirent.name)),
    type: dirent.isDirectory() ? 'folder' : 'file'
  }
}

/**
 * Converts a stat to an asset.
 * @param parent The root parent path to strip out.
 * @param fullPath The full absolute path to the file/folder.
 * @param stat The fs.Stats object returned by fs.stat().
 */
export const statToAsset = (parent: string, fullPath: string, stat: Stats): Asset => {
  return {
    path: toAssetPath(parent, fullPath),
    type: stat.isDirectory() ? 'folder' : 'file'
  }
}
