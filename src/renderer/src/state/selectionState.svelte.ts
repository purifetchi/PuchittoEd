import type { GameObject } from 'puchitto/objects'

export const selectionState = $state({
  id: -1
})

export const setSelectedObject = (go: GameObject<unknown>): void => {
  selectionState.id = go.id
}

export const resetSelectedObject = (): void => {
  selectionState.id = -1
}
