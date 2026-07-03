import type { GameObject } from 'puchitto/objects'
import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'
import { selectionState } from '../../state/selectionState.svelte'
import { recordTransformManipulation } from '../systems/history/commands/entityTransformManipulationCommand'

export class BringObjectToViewTool extends HotkeyTool {
  private _object?: GameObject

  constructor() {
    super({
      key: 'KeyF',
      modifiers: ['ControlLeft', 'AltLeft']
    })
  }

  get name(): string {
    return 'tool.bringObjectToView'
  }

  get menuBarPath(): string {
    return 'Object/Bring to View'
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

    const camera = game.editorCamera

    recordTransformManipulation(this._object, () => {
      this._object.transform.position.copy(camera.transform.position)
      this._object.transform.rotation.copy(camera.transform.rotation)
    })

    return HotkeyHandlingResult.FINISHED
  }
}
