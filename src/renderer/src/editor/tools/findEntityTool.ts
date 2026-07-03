import { resetSelectedObject, setSelectedObject } from '../../state/selectionState.svelte'
import type { EditorGame } from '../editorGame'
import { openEntitySearch } from '../helpers/searchHelpers'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'

export class FindEntityTool extends HotkeyTool {
  constructor() {
    super({
      key: 'KeyF',
      modifiers: ['ControlLeft']
    })
  }

  get name(): string {
    return 'tool.findEntity'
  }

  get menuBarPath(): string {
    return 'Object/Find'
  }

  available(game: EditorGame): boolean {
    return game !== undefined
  }

  tick(game: EditorGame): HotkeyHandlingResult {
    openEntitySearch().then((id) => {
      if (id === undefined) {
        resetSelectedObject()
      } else {
        setSelectedObject(game.getObjectById(id))
      }
    })

    return HotkeyHandlingResult.FINISHED
  }
}
