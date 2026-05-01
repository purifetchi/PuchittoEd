import { MOUSE_LEFT } from 'puchitto'
import { GameObject, type GameObjectOptions } from 'puchitto/objects'
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  type ColorRepresentation,
  Plane,
  Ray
} from 'three'

/**
 * The transform handles.
 */
export class TransformsObject extends GameObject {
  /**
   * The shared box mesh.
   */
  private _box = new BoxGeometry(0.1, 0.1)

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

  constructor(opts: GameObjectOptions) {
    super(opts)

    this.tag = 'editor'
    this.setObject(undefined)

    const meshX = this._makePositionMesh('#f44336', 'x')
    const meshY = this._makePositionMesh('#4caf50', 'y')
    const meshZ = this._makePositionMesh('#2196f3', 'z')

    this.attachThreeObject(meshX)
    this.attachThreeObject(meshY)
    this.attachThreeObject(meshZ)

    meshX.rotateOnWorldAxis(new Vector3(0, 1, 0), Math.PI / 2)
    meshY.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 2)

    meshX.position.x += 0.5
    meshY.position.y += 0.5
    meshZ.position.z += 0.5
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

    this.transform.position = this._selectedObject.transform.position

    if (this._currentAxis !== undefined) {
      if (!this.game.input.mouseHeld(MOUSE_LEFT)) {
        this._lastPoint = undefined
        this.setHandlingAxis(undefined)
        return
      }

      const tgt = this._getProjectedPoint()
      if (this._lastPoint === undefined) {
        this._lastPoint = tgt
        return
      }

      const delta = tgt.clone().sub(this._lastPoint)
      this._doPositionTransform(delta)
      this._lastPoint = tgt
    }
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
   * Performs a position transform.
   * @param delta The delta movement vector between the last two projected points.
   */
  private _doPositionTransform(delta: Vector3): void {
    switch (this._currentAxis) {
      case 'x':
        this._selectedObject.transform.position.x += delta.x
        break

      case 'y':
        this._selectedObject.transform.position.y += delta.y
        break

      case 'z':
        this._selectedObject.transform.position.z += delta.z
        break
    }
  }

  /**
   * Creates the positional mesh.
   * @param color The color of the axis.
   * @param axis The current axis.
   * @returns A mesh.
   */
  private _makePositionMesh(color: ColorRepresentation, axis: string): Mesh {
    const mat = new MeshBasicMaterial({
      color: color,
      depthWrite: false,
      depthTest: false,
      transparent: true
    })
    const mesh = new Mesh(this._box, mat)
    mesh.name = axis

    return mesh
  }
}
