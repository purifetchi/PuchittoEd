import { Game, GameLoader } from 'puchitto'
import { AssetProtocolDataProvider } from './assetProtocolDataProvider'
import type { EntityFactory } from 'puchitto/level'
import { EditorCameraObject } from './entities/editorCameraObject'
import { SceneObjectSelectionSystem } from './systems/sceneObjectSelectionSystem.svelte'
import type { GameObject, GameObjectOptions } from 'puchitto/objects'
import { PlaceholderObject } from './entities/placeholderObject'
import { buildLevelJsonData } from './saving/levelBuilder'
import type { GameData } from './data/gameData'
import { IconGizmo } from './entities/gizmos/iconGizmo'
import { GridObject } from './entities/gridObject'
import { Vector3 } from 'three'

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

  private _tmp = -3

  /**
   * Registers custom editor objects.
   */
  protected registerCustomEntities(factory: EntityFactory): void {
    factory.registerEntity<EditorCameraObject>('editor_camera', EditorCameraObject)
    factory.registerEntity<IconGizmo>('editor_icon_gizmo', IconGizmo)
    factory.registerEntity<GridObject>('editor_grid', GridObject)

    factory.registerUnknownEntityHandler(this._makeUnknownEntity.bind(this))
  }

  /**
   * Registers the custom editor game systems.
   */
  protected registerCustomGameSystems(): void {
    this.addGameSystem(new SceneObjectSelectionSystem())
  }

  protected registerCustomEventStreamHandlers(): void {
    this.eventStream.on('objectAttached', this._createObjectGizmos.bind(this))
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

    const data = await fetch('editor://puchitto/config.json')
    this.gameData = (await data.json()) as GameData

    this._dataManager.addProvider(new AssetProtocolDataProvider())
    const gameLoader = new GameLoader(this)
    await gameLoader.load()
  }

  /**
   * Saves the level.
   */
  async saveLevel(): Promise<void> {
    const data = buildLevelJsonData(editor)
    await window.puchittoAPI.saveLevel(data)
  }

  /**
   * Creates gizmos for the given object.
   * @param obj The game object.
   */
  private _createObjectGizmos(obj: GameObject): void {
    if (obj.tag === 'editor') {
      return
    }

    const type = obj instanceof PlaceholderObject ? obj.type : this._entityFactory.resolveType(obj)
    let definition = this.gameData.entities.find((ent) => ent.type === type)

    if (definition === undefined) {
      if (obj instanceof PlaceholderObject) {
        const defaultEntity = this.gameData.entities.find((ent) => ent.type === 'default')
        if (defaultEntity === undefined) {
          return
        }

        definition = defaultEntity
      } else {
        return
      }
    }

    if (definition.gizmos === undefined) {
      return
    }

    for (const gizmoDef of definition.gizmos) {
      switch (gizmoDef.type) {
        case 'icon': {
          const icon = this._entityFactory.create<IconGizmo>('editor_icon_gizmo', this._tmp, {})
          icon.icon = `editor://puchitto/${gizmoDef.path}`

          this._tmp -= 1
          icon.threeObject.parent = obj.threeObject
          icon.target = obj
          this.addObject(icon)
          continue
        }

        default:
          continue
      }
    }
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

    this._editorCamera = this._entityFactory.create<EditorCameraObject>('editor_camera', -1, {
      width: res.x,
      height: res.y,
      type: 'perspective',
      fov: 90,
      near: 0.001
    })

    this._editorCamera.transform.position = new Vector3(0, 1, 0)
    this.addObject(this._editorCamera)

    const grid = this._entityFactory.create<GridObject>('editor_grid', -2, {})
    this.addObject(grid)
    grid.threeObject.rotateX(-Math.PI / 2)

    this.setMainCamera(this._editorCamera)
  }
}

/**
 * The singleton instance of the editor.
 */
export const editor: EditorGame = new EditorGame()
