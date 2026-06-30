import type { GameObject } from 'puchitto/objects'
import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'
import { selectionState } from '../../state/selectionState.svelte'
import { recordTransformManipulation } from '../systems/history/commands/entityTransformManipulationCommand'

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

  get menuBarPath(): string {
    return 'Object/Look at'
  }

  available(game: EditorGame): boolean {
    const id = selectionState.id
    if (id >= 0) {
      return game.getObjectById(id) !== undefined
    }

    return false
  }

  setup(game: EditorGame): void {
    const id = selectionState.id
    this._object = game.getObjectById(id)
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

    recordTransformManipulation(this._object, () => {
      this._object.transform.lookAt(selectedObject)
    })

    return HotkeyHandlingResult.FINISHED
  }
}
