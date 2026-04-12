import type { GameObject } from "puchitto/objects"

export const selectionState = $state({
  id: -1
})

export const setSelectedObject = (go: GameObject<unknown>) => {
  selectionState.id = go.id
}
