import type { EditorGame } from '../../../editorGame'
import { HotkeyHandlingResult } from '../../hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../../hotkey/hotkeyTool'

export class RedoTool extends HotkeyTool {
  constructor() {
    super({
      key: 'KeyY',
      modifiers: ['ControlLeft']
    })
  }

  get name(): string {
    return 'tool.redo'
  }

  get menuBarPath(): string {
    return 'Edit/Redo'
  }

  available(game: EditorGame): boolean {
    return game.history.canRedo
  }

  tick(game: EditorGame): HotkeyHandlingResult {
    game.history.redo()
    return HotkeyHandlingResult.FINISHED
  }
}
