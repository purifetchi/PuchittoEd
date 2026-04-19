import { Game, GameLoader } from 'puchitto'
import { AssetProtocolDataProvider } from './assetProtocolDataProvider'
import type { EntityFactory } from 'puchitto/level'
import { EditorCameraObject } from './entities/editorCameraObject'
import { SceneObjectSelectionSystem } from './systems/sceneObjectSelectionSystem.svelte'
import type { GameObject, GameObjectOptions } from 'puchitto/objects'
import { PlaceholderObject } from './entities/placeholderObject'
import { buildLevelJsonData } from './saving/levelBuilder'
import type { GameData } from './data/gameData'

/**
 * The backing class for the editor, extending a normal Puchitto game.
 */
export class EditorGame extends Game {
  /**
   * The game data.
   */
  gameData: GameData

  /**
   * The editor camera.
   */
  private _editorCamera: EditorCameraObject

  /**
   * Registers custom editor objects.
   */
  protected registerCustomEntities(factory: EntityFactory): void {
    factory.registerEntity<EditorCameraObject>('editorcamera', EditorCameraObject)
    factory.registerUnknownEntityHandler(this._makeUnknownEntity.bind(this))
  }

  /**
   * Registers the custom editor game systems.
   */
  protected registerCustomGameSystems(): void {
    this.addGameSystem(new SceneObjectSelectionSystem())
  }

  /**
   * Creates a new scene.
   */
  newScene(): void {
    this.createScene()
    this._makeEditorEntities()
  }

  /**
   * Loads a level from a buffer.
   */
  async loadLevel(): Promise<void> {
    this.newScene()

    this._dataManager.addProvider(new AssetProtocolDataProvider())
    const gameLoader = new GameLoader(this)
    await gameLoader.load()

    const data = await fetch('editor://puchitto/config.json')
    this.gameData = (await data.json()) as GameData
  }

  /**
   * Saves the level.
   */
  async saveLevel(): Promise<void> {
    const data = buildLevelJsonData(editor)
    await window.puchittoAPI.saveLevel(data)
  }

  /**
   * Creates a placeholder object for unknown entities.
   * @param opts The options of the gameobject.
   * @param type The type of the gameobject.
   * @param data The extra data.
   * @returns The placeholder object.
   */
  private _makeUnknownEntity(
    opts: GameObjectOptions,
    type: string,
    data: Record<string, unknown>
  ): GameObject {
    console.log(`[EditorGame::_makeUnknownEntity] Created placeholder for ${type}.`)
    const placeholder = new PlaceholderObject({
      ...opts,
      type,
      data
    })

    return placeholder
  }

  /**
   * Adds the editor entities to the game.
   */
  private _makeEditorEntities(): void {
    const res = this._getResolution()

    this._editorCamera = this._entityFactory.create<EditorCameraObject>('editorcamera', -1, {
      width: res.x,
      height: res.y,
      type: 'perspective'
    })
    this.addObject(this._editorCamera)

    this.setMainCamera(this._editorCamera)
  }
}

/**
 * The singleton instance of the editor.
 */
export const editor: EditorGame = new EditorGame()
