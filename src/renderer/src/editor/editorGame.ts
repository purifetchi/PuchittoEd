import { Game, GameLoader } from 'puchitto'
import { AssetProtocolDataProvider } from './assetProtocolDataProvider'
import type { EntityFactory } from 'puchitto/level'
import { EditorCameraObject } from './entities/editorCameraObject'

/**
 * The backing class for the editor, extending a normal Puchitto game.
 */
export class EditorGame extends Game {
  /**
   * The editor camera.
   */
  private _editorCamera: EditorCameraObject

  /**
   * Registers custom editor objects.
   */
  protected registerCustomEntities(factory: EntityFactory): void {
    factory.registerEntity<EditorCameraObject>('editorcamera', EditorCameraObject)
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
