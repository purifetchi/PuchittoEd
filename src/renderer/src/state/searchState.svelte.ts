import { openModal } from './modalState.svelte'
import SearchModalSkeleton from '../components/modals/search/SearchModalSkeleton.svelte'

/**
 * The state of the search system.
 */
export const searchState = $state({
  state: undefined
} as {
  state?: SearchState
})

/**
 * The underlying search state.
 */
export type SearchState = {
  items: SearchItem[]
  groups?: string[]

  lockedGroup?: string
}

/**
 * A single item withing the search catalog.
 */
export interface SearchItem {
  /**
   * The name of the item.
   */
  name: string

  /**
   * The group it belongs to.
   */
  group?: string

  /**
   * Info displayed on the right hand side.
   */
  info?: string

  /**
   * The value of the search item.
   */
  value: unknown
}

/**
 * Opens a search modal.
 * @param items The items to search through.
 * @returns The selected item.
 */
export const openSearch = <TData>(
  items: SearchItem[],
  opts?: {
    forceGroup: string
  }
): Promise<TData | undefined> => {
  const potentialGroups = items.filter((i) => i.group !== undefined).map((i) => i.group)
  let groups: string[] | undefined = undefined
  if (potentialGroups.length > 0) {
    groups = []

    for (const group of potentialGroups) {
      const normalized = group.toLowerCase()
      const exists = groups.find((g) => g === normalized)

      if (exists) {
        continue
      }

      groups.push(normalized)
    }
  }

  searchState.state = {
    items,
    groups,
    lockedGroup: opts?.forceGroup
  }

  let resolver: (value: TData | undefined) => void
  const promise = new Promise<TData | undefined>((r) => {
    resolver = r
  })
  const resultPromise = openModal<TData>(SearchModalSkeleton)

  resultPromise.then((v) => {
    resolver(v)
    searchState.state = undefined
  })

  return promise
}
