import type { GameObject } from 'puchitto/objects'
import { editor } from '../editor/editorGame'

export const selectionState = $state({
  id: -1
})

export const setSelectedObject = (go: GameObject): void => {
  selectionState.id = go.id
  editor?.handles?.setObject(go)
}

export const resetSelectedObject = (): void => {
  selectionState.id = -1
  editor?.handles?.setObject(undefined)
}
