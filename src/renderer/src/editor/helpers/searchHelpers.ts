import { openSearch } from '../../state/searchState.svelte'
import { editor } from '../editorGame'

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
        info: editor._entityFactory.resolveType(o),
        group: type,
        value: o.id
      }
    })

  return openSearch<number>(entities, {
    forceGroup: desiredType
  })
}
