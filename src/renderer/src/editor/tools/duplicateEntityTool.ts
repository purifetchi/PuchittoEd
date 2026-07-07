import type { GameObject } from 'puchitto/objects'
import { selectionState, setSelectedObject } from '../../state/selectionState.svelte'
import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'
import { recordCommand } from '../systems/history/editorHistory'
import {
  EntityCreatedCommand,
  getSerializedDataForObject
} from '../systems/history/commands/entityCreatedCommand'
import { PlaceholderObject } from '../entities/placeholderObject'

/**
 * Duplicates an entity.
 */
export class DuplicateEntityTool extends HotkeyTool {
  private _object?: GameObject

  constructor() {
    super({
      key: 'KeyD',
      modifiers: ['ControlLeft']
    })
  }

  get name(): string {
    return 'tool.duplicateEntity'
  }

  get menuBarPath(): string {
    return 'Object/Duplicate'
  }

  get menuOrder(): number {
    return 0
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

    // Get the type of the current object.
    const type =
      this._object instanceof PlaceholderObject
        ? this._object.type
        : game._entityFactory.resolveType(this._object)

    const data = getSerializedDataForObject(this._object, type)
    const newObject = this._createObject(game, type, data)

    // Apply the transforms as well.
    newObject.transform.copy(this._object)

    return HotkeyHandlingResult.FINISHED
  }

  /**
   * Creates the new object.
   * @param game The game to create it within.
   * @param type The type of the object.
   * @param data The data of the object.
   */
  private _createObject(game: EditorGame, type: string, data: Record<string, unknown>): GameObject {
    const object = game._entityFactory.create<GameObject>(type, game.allocator.get(), data)
    game.addObject(object)

    recordCommand(new EntityCreatedCommand(object))

    setSelectedObject(object)

    return object
  }
}
