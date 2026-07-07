import { assetBrowserState } from '../../state/assetState.svelte'
import { openSearch } from '../../state/searchState.svelte'
import { editor } from '../editorGame'
import { type FileFormat } from './formatHelpers'

/**
 * Opens the entity search modal.
 * @param desiredType The desired type we want.
 * @returns The id of the entity.
 */
export const openEntitySearch = (desiredType?: string): Promise<number | undefined> => {
  const entities = editor._objects
    .filter((o) => o.id >= 0)
    .map((o) => {
      const type = editor._entityFactory.resolveType(o)
      return {
        name: o.name,
        info: type,
        group: type,
        value: o.id
      }
    })

  return openSearch<number>(entities, {
    forceGroup: desiredType
  })
}

/**
 * Opens the asset search modal.
 * @param desiredType The desired asset type
 */
export const openAssetSearch = (desiredType?: FileFormat): Promise<string | undefined> => {
  const entities = assetBrowserState.assets
    .filter((o) => o.kind === 'file')
    .map((o) => {
      return {
        name: o.name,
        info: o.type,
        group: o.type,
        value: o.path
      }
    })

  return openSearch<string>(entities, {
    forceGroup: desiredType
  })
}
