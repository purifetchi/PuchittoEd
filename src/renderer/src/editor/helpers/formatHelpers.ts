const imageFormats = ['png', 'tiff', 'tga', 'jpg', 'jpeg', 'gif']
const meshFormats = ['obj', 'glb', 'fbx']
const audioFormats = ['mp3', 'ogg', 'wav', 'flac']

/**
 * The possible supported file formats.
 */
export type FileFormat = 'audio' | 'texture' | 'mesh' | 'unknown'

/**
 * Deduces the format from the filename.
 */
export const deduceFormat = (filename: string | undefined): FileFormat => {
  if (filename === undefined) {
    return 'unknown'
  }

  const smaller = filename.toLowerCase()
  if (imageFormats.some((f) => smaller.endsWith(f))) {
    return 'texture'
  }

  if (meshFormats.some((f) => smaller.endsWith(f))) {
    return 'mesh'
  }

  if (audioFormats.some((f) => smaller.endsWith(f))) {
    return 'audio'
  }

  return 'unknown'
}
