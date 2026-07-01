import type { GameObject } from 'puchitto/objects'
import type { EditorGame } from '../editorGame'
import { HotkeyHandlingResult } from '../systems/hotkey/hotkeyHandlingResult'
import { HotkeyTool } from '../systems/hotkey/hotkeyTool'
import { recordCommand } from '../systems/history/editorHistory'
import { EntityCreatedCommand } from '../systems/history/commands/entityCreatedCommand'
import { setSelectedObject } from '../../state/selectionState.svelte'
import type { EditorEntityDefinition } from '../data/editorEntityDefinition'
import { openSearch, type SearchItem } from '../../state/searchState.svelte'

export class CreateEntityTool extends HotkeyTool {
  constructor() {
    super({
      key: 'KeyA',
      modifiers: ['ShiftLeft']
    })
  }

  get name(): string {
    return 'tool.createEntity'
  }

  get menuBarPath(): string {
    return 'Object/Create'
  }

  get menuOrder(): number {
    return 0
  }

  available(game: EditorGame): boolean {
    return game !== undefined
  }

  tick(game: EditorGame): HotkeyHandlingResult {
    openSearch<string>(game.gameData.entities.map((e) => this._mapEntityToSearchItem(e))).then(
      (ent) => {
        if (ent !== undefined) {
          this._createObject(game, ent)
        }
      }
    )
    return HotkeyHandlingResult.FINISHED
  }

  /**
   * Maps entity definitions to search items.
   * @param ent The entity definition.
   * @returns The resulting search item.
   */
  private _mapEntityToSearchItem(ent: EditorEntityDefinition): SearchItem {
    return {
      name: ent.displayName,
      info: ent.type,
      group: ent.group,
      value: ent.type
    }
  }

  /**
   * Creates the new object.
   * @param game The game to create it within.
   * @param type The type of the object.
   */
  private _createObject(game: EditorGame, type: string): void {
    const object = game._entityFactory.create<GameObject>(type, game.allocator.get(), {})
    game.addObject(object)

    recordCommand(new EntityCreatedCommand(object))

    setSelectedObject(object)
  }
}
