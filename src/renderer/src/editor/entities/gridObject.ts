import { GameObject, type GameObjectOptions } from 'puchitto/objects'
import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import { fragment, vertex } from '../shaders/gridShader'

/**
 * The editor grid.
 */
export class GridObject extends GameObject {
  /**
   * The shader.
   */
  private _shader: ShaderMaterial

  constructor(opts: GameObjectOptions) {
    super(opts)

    this.tag = 'editor'
    this._shader = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        size: { value: 1 }
      },
      transparent: true,
      depthWrite: false,
      side: DoubleSide
    })

    const geometry = new PlaneGeometry(10000, 10000)
    this.attachThreeObject(new Mesh(geometry, this._shader))
    this.threeObject.frustumCulled = false
  }
}
