import { GameObject } from 'puchitto/objects'

export abstract class GenericGizmo extends GameObject {
  /**
   * The target of the gizmo.
   */
  target: GameObject

  constructor(opts) {
    super(opts)

    this.tag = 'internal'
  }
}
