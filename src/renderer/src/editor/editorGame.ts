import { Game, GameLoader } from 'puchitto'
import { AssetProtocolDataProvider } from './assetProtocolDataProvider'
import type { EntityFactory } from 'puchitto/level'
import { EditorCameraObject } from './entities/editorCameraObject'
import { SceneObjectSelectionSystem } from './systems/sceneObjectSelectionSystem.svelte'
import type { CameraObject, GameObject, GameObjectOptions } from 'puchitto/objects'
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
import { EditorHistory } from './systems/history/editorHistory'
import { registerToolsInSystem } from './systems/hotkey/hotkeyToolRegistrar'

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
   * The editor's history.
   */
  readonly history: EditorHistory = new EditorHistory(this)

  /**
   * The editor camera.
   */
  private _editorCamera: EditorCameraObject

  /**
   * The grid.
   */
  private _grid?: GridObject

  /**
   * A map from the object ids to the gizmos it contains.
   */
  private _objectGizmoMap: Map<number, GenericGizmo[]> = new Map<number, GenericGizmo[]>()

  /**
   * The hotkey tool system.
   */
  private _toolSystem: HotkeyToolSystem

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
   * Invokes an editor tool.
   * @param toolName The tool to invoke.
   */
  invokeEditorTool(toolName: string): void {
    this._toolSystem.invokeTool(toolName)
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
    this.eventStream.on('objectRemoved', this._removeObjectGizmos.bind(this))

    this.eventStream.on('loaded', this._onRealmLoaded.bind(this))
  }

  protected createDefaultCamera(): CameraObject {
    const res = this._getResolution()

    this._editorCamera = this._entityFactory.create<EditorCameraObject>(
      'editor_camera',
      this.getNextInternalId(),
      {
        width: res.x,
        height: res.y,
        type: 'perspective',
        fov: 90,
        near: 0.001
      }
    )

    return this._editorCamera
  }

  protected resolveMainCamera(): CameraObject {
    return this._editorCamera
  }

  private _createHotkeyToolSystem(): HotkeyToolSystem {
    this._toolSystem = new HotkeyToolSystem()
    registerToolsInSystem(this._toolSystem)

    return this._toolSystem
  }

  /**
   * Creates the editor allocators.
   */
  private _createAllocators(): void {
    this.allocator = new IdAllocator()
  }

  /**
   * Creates a new scene.
   */
  newScene(): void {
    this.history.reset()
    this._createAllocators()

    this.createScene()
    this._makeEditorEntities()
    this._dataManager.addProvider(new AssetProtocolDataProvider())
  }

  /**
   * Loads a level from a buffer.
   */
  async loadLevel(): Promise<void> {
    this.newScene()

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
            this.getNextInternalId(),
            {}
          )
          icon.icon = `editor://puchitto/${gizmoDef.path}`

          gizmo = icon
          break
        }

        case 'sphere': {
          const sphere = this._entityFactory.create<SphereGizmo>(
            'editor_sphere_gizmo',
            this.getNextInternalId(),
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
            this.getNextInternalId(),
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
   * Removes the gizmos for a given object.
   * @param obj The object to remove the gizmos for.
   */
  private _removeObjectGizmos(obj: GameObject): void {
    if (!this.ready || obj.tag === 'editor' || this.gameData === undefined) {
      return
    }

    const gizmos = this._objectGizmoMap.get(obj.id)
    if (gizmos === undefined) {
      return
    }

    for (const gizmo of gizmos) {
      this.removeObject(gizmo)
    }

    this._objectGizmoMap.delete(obj.id)
  }

  /**
   * Called when we load into the realm.
   */
  private _onRealmLoaded(): void {
    let maxId = 0
    for (const obj of this._objects) {
      maxId = Math.max(maxId, obj.id)
    }

    this.allocator = new IdAllocator({
      last: maxId
    })
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
    this._editorCamera.transform.position = new Vector3(0, 1, 0)
    this.addObject(this._editorCamera)

    this._grid = this._entityFactory.create<GridObject>('editor_grid', this.getNextInternalId(), {})
    this.addObject(this._grid)
    this._grid.threeObject.rotateX(-Math.PI / 2)

    this.handles = this._entityFactory.create<TransformsObject>(
      'editor_transforms',
      this.getNextInternalId(),
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
