import { Serialized } from 'puchitto/serialization'
import { GenericGizmo } from './genericGizmo'
import { AssetLoading } from 'puchitto/mixins'
import { Group, Mesh, MeshBasicMaterial, type ColorRepresentation } from 'three'

/**
 * A mesh-based gizmo.
 */
export class MeshGizmo extends AssetLoading(GenericGizmo) {
  @Serialized('model')
  accessor model: string = ''

  @Serialized('color')
  accessor color: ColorRepresentation = 'white'

  @Serialized('scale')
  accessor scale: number = 1

  onSerializedPropertyChanged(path: string): void {
    if (path === 'model') {
      this._setModel()
    }

    this.transform.setUniformScale(this.scale)
  }

  private _setModel(): void {
    this.clearAttachments()

    this.loadAssetSync<Group>(this.model, (data) => {
      this.attachThreeObject(data)

      data.traverse((obj) => {
        if (!(obj instanceof Mesh)) {
          return
        }

        const isArray = Array.isArray(obj.material)
        const mats = isArray ? obj.material : [obj.material]
        for (let i = 0; i < mats.length; i++) {
          mats[i] = new MeshBasicMaterial({
            color: 'white',
            map: mats[i].map
          })
        }

        obj.material = isArray ? mats : mats[0]
      })
    })
  }
}
