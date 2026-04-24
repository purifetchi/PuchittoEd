import { type GameObjectOptions } from 'puchitto/objects'
import { Serialized } from 'puchitto/serialization'
import {
  SpriteMaterial,
  Sprite,
  TextureLoader,
  ClampToEdgeWrapping,
  Color,
  SRGBColorSpace
} from 'three'
import { GenericGizmo } from './genericGizmo'

/**
 * A generic icon gizmo.
 */
export class IconGizmo extends GenericGizmo {
  @Serialized('icon')
  accessor icon!: string

  /**
   * The material.
   */
  private _mat: SpriteMaterial

  constructor(opts: GameObjectOptions) {
    super(opts)

    this._mat = new SpriteMaterial({
      color: new Color('white'),
      transparent: true
    })
    this.attachThreeObject(new Sprite(this._mat))
  }

  onSerializedPropertyChanged(): void {
    this._mat.map?.dispose()

    const loader = new TextureLoader()
    loader.load(this.icon, (tex) => {
      tex.wrapS = ClampToEdgeWrapping
      tex.wrapT = ClampToEdgeWrapping

      tex.colorSpace = SRGBColorSpace

      this._mat.map = tex

      this._mat.needsUpdate = true
    })
  }
}
