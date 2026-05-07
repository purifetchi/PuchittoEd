import { OBJLoader } from 'three/examples/jsm/Addons.js'
import { Serialized } from 'puchitto/serialization'
import { GenericGizmo } from './genericGizmo'
import { AssetLoading } from 'puchitto/mixins'
import { Mesh, MeshBasicMaterial, type ColorRepresentation } from 'three'

/**
 * A mesh-based gizmo.
 */
export class MeshGizmo extends AssetLoading(GenericGizmo) {
  @Serialized('model')
  accessor model: string = ''

  @Serialized('color')
  accessor color: ColorRepresentation = 'white'

  onSerializedPropertyChanged(path: string): void {
    if (path === 'model') {
      this._setModel()
    }
  }

  private _setModel(): void {
    this.beginAssetLoad()
    this.clearAttachments()

    new OBJLoader().load(this.model, (data) => {
      this.attachThreeObject(data)

      data.traverse((o) => {
        if (!(o instanceof Mesh)) {
          return
        }

        o.material = new MeshBasicMaterial({
          color: this.color,
          wireframe: true
        })
      })
      this.finishAssetLoad()
    })
  }
}
