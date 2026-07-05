import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'

/**
 * Saves the realm.
 */
export class SaveTool extends HotkeyTool {
  constructor() {
    super({
      key: 'KeyS',
      modifiers: ['ControlLeft']
    })
  }

  get name(): string {
    return 'tool.save'
  }

  available(game: EditorGame): boolean {
    return game !== undefined
  }

  tick(game: EditorGame): HotkeyHandlingResult {
    game.saveLevel()

    return HotkeyHandlingResult.FINISHED
  }
}
