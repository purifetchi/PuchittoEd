import type { EditorGame } from '../../../editorGame'
import { HotkeyHandlingResult } from '../../hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../../hotkey/hotkeyTool'

export class UndoTool extends HotkeyTool {
  constructor() {
    super({
      key: 'KeyZ',
      modifiers: ['ControlLeft']
    })
  }

  get name(): string {
    return 'tool.undo'
  }

  available(game: EditorGame): boolean {
    return game.history.canUndo
  }

  tick(game: EditorGame): HotkeyHandlingResult {
    game.history.undo()
    return HotkeyHandlingResult.FINISHED
  }
}
