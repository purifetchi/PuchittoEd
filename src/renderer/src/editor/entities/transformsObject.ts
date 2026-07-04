import { MOUSE_LEFT } from 'puchitto'
import { GameObject, type GameObjectOptions } from 'puchitto/objects'
import {
  Vector3,
  Plane,
  Ray,
  Group,
  Mesh,
  type ColorRepresentation,
  MeshBasicMaterial,
  Euler
} from 'three'
import { OBJLoader } from 'three/examples/jsm/Addons.js'
import { transformsState } from '../../state/transformsState.svelte'
import {
  EntityTransformManipulationCommand,
  packTransform,
  type HistoryTransform
} from '../systems/history/commands/entityTransformManipulationCommand'
import { recordCommand } from '../systems/history/editorHistory'

/**
 * The tool type.
 */
export type Tool = 'position' | 'rotation' | 'scale'

/**
 * The space we are operating in.
 */
export type Space = 'world' | 'local'

/**
 * The transform handles.
 */
export class TransformsObject extends GameObject {
  /**
   * The base rotation
   */
  private readonly BASE_ROT = new Euler(0, 0, 0)

  /**
   * The currently selected object.
   */
  private _selectedObject?: GameObject

  /**
   * The current axis.
   */
  private _currentAxis?: string

  /**
   * The last point.
   */
  private _lastPoint?: Vector3

  /**
   * The transform that we began at.
   */
  private _beginningTransform?: HistoryTransform

  constructor(opts: GameObjectOptions) {
    super(opts)

    this.tag = 'editor'
    this.setObject(undefined)

    this.transform.setUniformScale(0.5)

    new OBJLoader(opts.loader).load('editor://puchitto/models/handles/move.obj', (data) => {
      this._colorModel(data)
      this.attachThreeObject(data)
    })
  }

  /**
   * Sets the currently selected object.
   * @param object The selected object.
   */
  setObject(object: GameObject | undefined): void {
    this._selectedObject = object

    const selectedAnything = this._selectedObject !== undefined
    this.setVisible(selectedAnything)
  }

  /**
   * Sets the currently handled axis.
   * @param axis The currently handled axis.
   */
  setHandlingAxis(axis: string | undefined): void {
    this._currentAxis = axis
  }

  /**
   * Ticks the transforms.
   */
  tick(): void {
    if (this._selectedObject === undefined) {
      return
    }

    this._doDistanceScale()
    this._switchTools()

    if (this._currentAxis !== undefined) {
      if (!this.game.input.mouseHeld(MOUSE_LEFT)) {
        this._lastPoint = undefined

        recordCommand(
          new EntityTransformManipulationCommand(
            this._selectedObject,
            this._beginningTransform,
            packTransform(this._selectedObject)
          )
        )

        this._beginningTransform = undefined
        this.setHandlingAxis(undefined)
        return
      }

      const tgt = this._getProjectedPoint()
      if (this._lastPoint === undefined) {
        this._lastPoint = tgt
        this._beginningTransform = packTransform(this._selectedObject)
        return
      }

      const delta = tgt.clone().sub(this._lastPoint)

      switch (transformsState.tool) {
        case 'position':
          this._doPositionTransform(delta)
          break

        case 'rotation':
          this._doRotationTransform(delta)
          break

        case 'scale':
          this._doScaleTransform(delta)
          break
      }

      this._lastPoint = tgt
    }

    this.transform.position = this._selectedObject.transform.position

    if (transformsState.space === 'local') {
      this.transform.rotation = this._selectedObject.transform.rotation
    } else {
      this.transform.euler = this.BASE_ROT
    }
  }

  /**
   * Does the distance-based scaling of the gizmos.
   */
  private _doDistanceScale(): void {
    // Calculate the distance between the editor camera and the transforms
    const baseline = 0.5
    const distance = this.transform.position.distanceTo(this.game._camera.transform.position)

    let scale = baseline
    if (distance > 4) {
      scale += (distance - 4) / 20
    }

    this.transform.setUniformScale(scale)
  }

  /**
   * Gets a projected point alongside the camera-facing plane located at the selected object's position.
   * @returns The projected point.
   */
  private _getProjectedPoint(): Vector3 {
    const cam = this.game._camera.camera
    const objPos = this._selectedObject.transform.position

    const planeNormal = cam.getWorldDirection(new Vector3()).negate()
    const plane = new Plane().setFromNormalAndCoplanarPoint(planeNormal, objPos)

    const ndc = this.game.getNdcPosition()
    const ray = new Ray()
    ray.origin.setFromMatrixPosition(cam.matrixWorld)
    ray.direction.set(ndc.x, ndc.y, 0.5).unproject(cam).sub(ray.origin).normalize()

    const target = new Vector3()
    ray.intersectPlane(plane, target)

    return target
  }

  /**
   * Switches the tools.
   */
  private _switchTools(): void {
    if (this.game.input.cursorLocked) {
      return
    }

    if (this.game.input.keyDown('KeyR')) {
      transformsState.tool = 'rotation'
    } else if (this.game.input.keyDown('KeyS')) {
      transformsState.tool = 'scale'
    } else if (this.game.input.keyDown('KeyG')) {
      transformsState.tool = 'position'
    }
  }

  /**
   * Performs a position transform.
   * @param delta The delta movement vector between the last two projected points.
   */
  private _doPositionTransform(delta: Vector3): void {
    let direction: Vector3
    let length: number = 0
    switch (this._currentAxis) {
      case 'x':
        direction =
          transformsState.space === 'local'
            ? this._selectedObject.transform.right
            : new Vector3(1, 0, 0)

        length = delta.x
        break

      case 'y':
        direction =
          transformsState.space === 'local'
            ? this._selectedObject.transform.up
            : new Vector3(0, 1, 0)

        length = delta.y
        break

      case 'z':
        direction =
          transformsState.space === 'local'
            ? this._selectedObject.transform.forward
            : new Vector3(0, 0, 1)

        length = delta.z
        break

      case 'all':
        this._selectedObject.transform.position.add(delta)
        return
    }

    this._selectedObject.transform.position.add(direction.multiplyScalar(length))
  }

  /**
   * Performs a rotation transform.
   * @param delta The delta movement vector between the last two projected points.
   */
  private _doRotationTransform(delta: Vector3): void {
    switch (this._currentAxis) {
      case 'x':
        this._selectedObject.transform.euler.x += delta.x
        break

      case 'y':
        this._selectedObject.transform.euler.y += delta.y
        break

      case 'z':
        this._selectedObject.transform.euler.z += delta.z
        break
    }
  }

  /**
   * Performs a scaling transform.
   * @param delta The delta movement vector between the last two projected points.
   */
  private _doScaleTransform(delta: Vector3): void {
    switch (this._currentAxis) {
      case 'x':
        this._selectedObject.transform.scale.x += delta.x
        break

      case 'y':
        this._selectedObject.transform.scale.y += delta.y
        break

      case 'z':
        this._selectedObject.transform.scale.z += delta.z
        break
    }
  }

  /**
   * Colors the model.
   * @param model The model.
   */
  private _colorModel(model: Group): void {
    model.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return
      }

      let color: ColorRepresentation
      switch (child.name) {
        case 'x':
          color = '#f44336'
          break

        case 'y':
          color = '#4caf50'
          break

        case 'z':
          color = '#2196f3'
          break

        default:
          color = 'white'
          break
      }

      const mat = new MeshBasicMaterial({
        color: color,
        depthWrite: false,
        depthTest: false,
        transparent: true
      })

      child.material = mat
    })
  }
}
