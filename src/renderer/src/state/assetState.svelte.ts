import type { Asset } from '../../../preload/editor/assetOps'
import { deduceFormat, type FileFormat } from '../editor/helpers/formatHelpers'

/**
 * A node in the asset tree.
 */
export type AssetNode =
  | { kind: 'folder'; name: string; path: string }
  | { kind: 'file'; name: string; path: string; type: FileFormat }

/**
 * The state of the asset browser.
 */
export const assetBrowserState = $state({
  assets: []
} as {
  assets: AssetNode[]
})

export const assetsInFolder = (assets: AssetNode[], folder: string): AssetNode[] => {
  const prefix = !folder.endsWith('/') ? folder + '/' : folder

  const folders: AssetNode[] = []
  const files: AssetNode[] = []

  for (const asset of assets) {
    if (!asset.path.startsWith(prefix)) {
      continue
    }

    const rest = asset.path.slice(prefix.length)
    const slash = rest.indexOf('/')
    if (slash > -1) {
      continue
    }

    if (asset.kind === 'file') {
      files.push({ kind: 'file', name: asset.name, path: asset.path, type: asset.type })
    } else {
      folders.push({ kind: 'folder', name: asset.name, path: asset.path })
    }
  }
  return [
    ...[...folders].sort((a, b) => a.name.localeCompare(b.name)),
    ...files.sort((a, b) => a.name.localeCompare(b.name))
  ]
}

/**
 * Converts an asset to an asset node.
 * @param asset The imported asset.
 */
export const assetToAssetNode = (asset: Asset): AssetNode => {
  const name = asset.path.split('\\').pop()
  const path = asset.path.replaceAll('\\', '/')

  switch (asset.type) {
    case 'folder':
      return {
        kind: 'folder',
        name: name,
        path: path
      }

    case 'file':
      return {
        kind: 'file',
        name: name,
        path: path,
        type: deduceFormat(path)
      }

    default:
      throw new Error('Unknown asset type.')
  }
}
