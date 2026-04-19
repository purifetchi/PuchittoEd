import { GameObject, type GameObjectOptions } from 'puchitto/objects'
import { Object3D } from 'three'

export class PlaceholderObject extends GameObject {
  /**
   * The type the object is substituting.
   */
  type: string

  /**
   * The data.
   */
  data: Record<string, unknown>

  constructor(
    opts: GameObjectOptions & {
      type: string
      data: Record<string, unknown>
    }
  ) {
    super(opts)

    const { type, data } = opts

    this.type = type
    this.data = data

    this.threeObject = new Object3D()
  }

  onGameSet(): void {
    this._attach()
  }
}
