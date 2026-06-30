import type { GameObject } from 'puchitto/objects'
import { selectionState } from '../../state/selectionState.svelte'
import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'
import { recordCommand } from '../systems/history/editorHistory'
import { EntityDeletedCommand } from '../systems/history/commands/entityDeletedCommand'

export class DeleteTool extends HotkeyTool {
  private _object?: GameObject

  constructor() {
    super({
      key: 'Delete',
      modifiers: []
    })
  }

  get name(): string {
    return 'tool.delete'
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

    recordCommand(new EntityDeletedCommand(this._object))
    game.removeObject(this._object)

    return HotkeyHandlingResult.FINISHED
  }
}
