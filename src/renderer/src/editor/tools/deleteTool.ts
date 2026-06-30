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

  get menuBarPath(): string {
    return 'Object/Delete'
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

    recordCommand(new EntityDeletedCommand(this._object))
    game.removeObject(this._object)

    return HotkeyHandlingResult.FINISHED
  }
}
