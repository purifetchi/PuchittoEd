import { GameObject, type GameObjectOptions } from 'puchitto/objects'

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
  }
}
