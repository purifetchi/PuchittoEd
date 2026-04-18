import type { GameObject } from 'puchitto/objects'

export const selectionState = $state({
  id: -1
})

export const setSelectedObject = (go: GameObject): void => {
  selectionState.id = go.id
}

export const resetSelectedObject = (): void => {
  selectionState.id = -1
}
