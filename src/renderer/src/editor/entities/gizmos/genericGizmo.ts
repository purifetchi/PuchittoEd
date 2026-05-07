import { GameObject } from 'puchitto/objects'

export class GenericGizmo extends GameObject {
  /**
   * The target of the gizmo.
   */
  target: GameObject

  /**
   * When to display the gizmo.
   */
  display: 'always' | 'selected' = 'always'

  constructor(opts) {
    super(opts)

    this.tag = 'internal'
  }
}
