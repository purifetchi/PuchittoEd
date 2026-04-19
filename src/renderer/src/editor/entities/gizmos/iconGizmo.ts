import { type GameObjectOptions } from 'puchitto/objects'
import { Serialized } from 'puchitto/serialization'
import { SpriteMaterial, Sprite, TextureLoader } from 'three'
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

    this._mat = new SpriteMaterial()
    this.threeObject = new Sprite(this._mat)
  }

  onGameSet(): void {
    this._attach()
  }

  onSerializedPropertyChanged(): void {
    this._mat.map?.dispose()

    const loader = new TextureLoader()
    loader.load(this.icon, (tex) => {
      this._mat.map = tex
    })
  }
}
