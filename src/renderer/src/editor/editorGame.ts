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
import type { AssetOp } from '../../../preload/editor/assetOps'
import { assetBrowserState } from '../state/assetState.svelte'
import { IdAllocator } from './idAllocator'
import { EventEmitter } from '@mary/events'
import { TransformsObject } from './entities/transformsObject'
import { SphereGizmo } from './entities/gizmos/sphereGizmo'
import type { GenericGizmo } from './entities/gizmos/genericGizmo'
import { MeshGizmo } from './entities/gizmos/meshGizmo'
import { selectionState } from '../state/selectionState.svelte'
import { callEditorReadyCallbacks } from './helpers/loadHelpers'
import { HotkeyToolSystem } from './systems/hotkeyToolSystem.svelte'
import { LookAtObjectTool } from './tools/lookAtObjectTool'

/**
 * The backing class for the editor, extending a normal Puchitto game.
 */
export class EditorGame extends Game {
  /**
   * Is the editor ready?
   */
  ready = false

  /**
   * The game data.
   */
  gameData: GameData

  /**
   * The ID allocator.
   */
  allocator: IdAllocator

  /**
   * The handles.
   */
  handles: TransformsObject

  /**
   * The event stream for the editor itself.
   */
  editorEventStream = new EventEmitter<{
    gameDataLoaded: []
  }>()

  /**
   * The editor camera.
   */
  private _editorCamera: EditorCameraObject

  /**
   * The grid.
   */
  private _grid?: GridObject

  /**
   * The editor ID allocator.
   */
  private _editorIdAllocator: IdAllocator

  /**
   * A map from the object ids to the gizmos it contains.
   */
  private _objectGizmoMap: Map<number, GenericGizmo[]> = new Map<number, GenericGizmo[]>()

  /**
   * Constructs a new editor.
   */
  constructor() {
    super()
    window.puchittoAPI.onAssetUpdate(this._onAssetBrowserUpdate.bind(this))

    this._loadInitialConfig()
  }

  /**
   * Gets the editor's main camera.
   */
  get editorCamera(): EditorCameraObject {
    return this._editorCamera
  }

  /**
   * Gets the gizmos for an object.
   * @param obj The object to get gizmos for.
   */
  getObjectGizmos(obj: GameObject): GenericGizmo[] | undefined {
    return this._objectGizmoMap.get(obj.id)
  }

  /**
   * Sets the visibility of editor objects.
   * @param visible Whether editor objects are visible/
   */
  setObjectEditorVisibility(visible: boolean): void {
    this.handles.setVisible(selectionState.id !== -1 && visible)
    this._grid?.setVisible(visible)

    for (const values of this._objectGizmoMap.values()) {
      for (const gizmo of values) {
        gizmo.setVisible(visible && (gizmo.display === 'always' || selectionState.id == gizmo.id))
      }
    }
  }

  /**
   * Sets the editor as ready.
   */
  async setReady(): Promise<void> {
    this.ready = true
    await callEditorReadyCallbacks()
  }

  /**
   * Load the initial config.
   */
  private async _loadInitialConfig(): Promise<void> {
    const data = await fetch('editor://puchitto/config.json')
    this.gameData = (await data.json()) as GameData

    this.editorEventStream.emit('gameDataLoaded')
  }

  /**
   * Registers custom editor objects.
   */
  protected registerCustomEntities(factory: EntityFactory): void {
    factory.registerEntity<EditorCameraObject>('editor_camera', EditorCameraObject)

    factory.registerEntity<IconGizmo>('editor_icon_gizmo', IconGizmo)
    factory.registerEntity<SphereGizmo>('editor_sphere_gizmo', SphereGizmo)
    factory.registerEntity<MeshGizmo>('editor_mesh_gizmo', MeshGizmo)

    factory.registerEntity<GridObject>('editor_grid', GridObject)
    factory.registerEntity<TransformsObject>('editor_transforms', TransformsObject)

    factory.registerUnknownEntityHandler(this._makeUnknownEntity.bind(this))
  }
  /**
   * Registers the custom editor game systems.
   */
  protected registerCustomGameSystems(): void {
    this.addGameSystem(new SceneObjectSelectionSystem())
    this.addGameSystem(this._createHotkeyToolSystem())
  }

  protected registerCustomEventStreamHandlers(): void {
    this.eventStream.on('objectAttached', this._createObjectGizmos.bind(this))
  }

  private _createHotkeyToolSystem(): HotkeyToolSystem {
    const toolSystem = new HotkeyToolSystem()

    toolSystem.registerTool(new LookAtObjectTool())

    return toolSystem
  }

  /**
   * Creates the editor allocators.
   */
  private _createAllocators(): void {
    this.allocator = new IdAllocator()
    this._editorIdAllocator = new IdAllocator({
      last: -1,
      skip: -1
    })
  }

  /**
   * Creates a new scene.
   */
  newScene(): void {
    this._createAllocators()

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
   * Saves the level.
   */
  async saveLevel(): Promise<void> {
    const data = buildLevelJsonData(editor)
    await window.puchittoAPI.saveLevel(data)
  }

  /**
   * Exports the level.
   */
  async exportLevel(): Promise<void> {
    const data = buildLevelJsonData(editor)
    await window.puchittoAPI.exportLevel(data)
  }

  /**
   * Called when the asset list changes.
   * @param ops The list of delta operations.
   */
  private _onAssetBrowserUpdate(ops: AssetOp[]): void {
    for (const op of ops) {
      switch (op.type) {
        case 'create':
          assetBrowserState.assets.push(op.name)
          continue

        case 'delete':
          assetBrowserState.assets = assetBrowserState.assets.filter((a) => a !== op.name)
          continue

        case 'clearAll':
          assetBrowserState.assets = []
          continue

        case 'bulkLoad':
          assetBrowserState.assets = assetBrowserState.assets.concat(op.names)
          continue
      }
    }

    assetBrowserState.assets.sort()
  }

  /**
   * Creates gizmos for the given object.
   * @param obj The game object.
   */
  private _createObjectGizmos(obj: GameObject): void {
    if (!this.ready || obj.tag === 'editor' || this.gameData === undefined) {
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

    const gizmos: GenericGizmo[] = []
    for (const gizmoDef of definition.gizmos) {
      let gizmo: GenericGizmo

      switch (gizmoDef.type) {
        case 'icon': {
          const icon = this._entityFactory.create<IconGizmo>(
            'editor_icon_gizmo',
            this._editorIdAllocator.get(),
            {}
          )
          icon.icon = `editor://puchitto/${gizmoDef.path}`

          gizmo = icon
          break
        }

        case 'sphere': {
          const sphere = this._entityFactory.create<SphereGizmo>(
            'editor_sphere_gizmo',
            this._editorIdAllocator.get(),
            {}
          )
          sphere.path = gizmoDef.path
          sphere.color = gizmoDef.color

          gizmo = sphere
          break
        }

        case 'mesh': {
          const mesh = this._entityFactory.create<MeshGizmo>(
            'editor_mesh_gizmo',
            this._editorIdAllocator.get(),
            {}
          )
          mesh.color = gizmoDef.color
          mesh.model = `editor://puchitto/${gizmoDef.path}`

          gizmo = mesh
          break
        }

        default:
          break
      }

      gizmo.threeObject.parent = obj.threeObject
      gizmo.target = obj
      gizmo.display = gizmoDef.display
      gizmo.setVisible(gizmoDef.display === 'always')
      this.addObject(gizmo)

      gizmos.push(gizmo)
    }

    this._objectGizmoMap.set(obj.id, gizmos)
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

    this._editorCamera = this._entityFactory.create<EditorCameraObject>(
      'editor_camera',
      this._editorIdAllocator.get(),
      {
        width: res.x,
        height: res.y,
        type: 'perspective',
        fov: 90,
        near: 0.001
      }
    )

    this._editorCamera.transform.position = new Vector3(0, 1, 0)
    this.addObject(this._editorCamera)

    this._grid = this._entityFactory.create<GridObject>(
      'editor_grid',
      this._editorIdAllocator.get(),
      {}
    )
    this.addObject(this._grid)
    this._grid.threeObject.rotateX(-Math.PI / 2)

    this.handles = this._entityFactory.create<TransformsObject>(
      'editor_transforms',
      this._editorIdAllocator.get(),
      {}
    )
    this.addObject(this.handles)

    this.setMainCamera(this._editorCamera)
  }
}

/**
 * The singleton instance of the editor.
 */
export const editor: EditorGame = new EditorGame()
