import { Serialized } from 'puchitto/serialization'
import { GenericGizmo } from './genericGizmo'
import type { GameObjectOptions } from 'puchitto/objects'
import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  type ColorRepresentation
} from 'three'

/**
 * A spherical gizmo.
 */
export class SphereGizmo extends GenericGizmo {
  /**
   * The accessor for the spherical gizmo.
   */
  @Serialized('path')
  accessor path!: string

  /**
   * The color of the sphere gizmo.
   */
  @Serialized('color')
  accessor color: ColorRepresentation

  /**
   * The mesh.
   */
  private _mat: MeshBasicMaterial

  /**
   * Constructs a new sphere gizmo.
   */
  constructor(opts: GameObjectOptions) {
    super(opts)

    const geom = new SphereGeometry(1)
    this._mat = new MeshBasicMaterial({
      color: 'red',
      opacity: 0.3,
      transparent: true,
      side: DoubleSide
    })

    const mesh = new Mesh(geom, this._mat)
    this.attachThreeObject(mesh)
  }

  onSerializedPropertyChanged(name: string): void {
    if (name === 'color') {
      this._mat.color = new Color(this.color)
      this._mat.needsUpdate = true
    }
  }

  tick(): void {
    if (!this.visible) {
      return
    }

    const radius = this.target[this.path]
    this.transform.setUniformScale(radius)
  }
}
