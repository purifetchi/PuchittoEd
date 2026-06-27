import type { GameObject } from 'puchitto/objects'
import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'
import { selectionState } from '../../state/selectionState.svelte'

export class LookAtObjectTool extends HotkeyTool {
  private _object?: GameObject

  constructor() {
    super({
      key: 'KeyL',
      modifiers: ['ShiftLeft']
    })
  }

  get name(): string {
    return 'tool.lookAtObject'
  }

  setup(game: EditorGame): boolean {
    const id = selectionState.id
    if (id < 0) {
      return false
    }

    const selectedObject = game.getObjectById(id)
    if (selectedObject === undefined) {
      return false
    }

    this._object = selectedObject
    return true
  }

  tick(game: EditorGame): HotkeyHandlingResult {
    if (this._object === undefined) {
      return HotkeyHandlingResult.FINISHED
    }

    const id = selectionState.id
    if (id < 0 || id === this._object.id) {
      return HotkeyHandlingResult.CONTINUE
    }

    const selectedObject = game.getObjectById(id)
    if (selectedObject === undefined) {
      return HotkeyHandlingResult.CONTINUE
    }

    this._object.transform.lookAt(selectedObject)

    return HotkeyHandlingResult.FINISHED
  }
}
