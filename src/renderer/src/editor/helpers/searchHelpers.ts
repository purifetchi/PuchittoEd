import { assetBrowserState } from '../../state/assetState.svelte'
import { openSearch } from '../../state/searchState.svelte'
import { editor } from '../editorGame'
import { deduceFormat, type FileFormat } from './formatHelpers'

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
  const entities = assetBrowserState.assets.map((o) => {
    // TODO: The format should probably be stored alongside the asset in the browser state.
    //       I am not putting that much effort into the Asset Browser for now, though.
    const type = deduceFormat(o)
    return {
      name: o,
      info: type,
      group: type,
      value: o
    }
  })

  return openSearch<string>(entities, {
    forceGroup: desiredType
  })
}
