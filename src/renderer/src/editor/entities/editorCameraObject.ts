import type { CameraEntityData } from 'puchitto/level'
import { CameraObject, type GameObjectOptions } from 'puchitto/objects'
import { Vector3 } from 'three'

const WORLD_Y_AXIS = new Vector3(0, 1, 0)

export class EditorCameraObject extends CameraObject {
  constructor(opts: GameObjectOptions & CameraEntityData) {
    super(opts)
    this.tag = 'editor'
  }

  /**
   * Updates the editor camera's movement.
   */
  tick(dt: number): void {
    if (!this.game.input.mouseHeld) {
      return
    }

    // Rotate the camera based on the delta!
    const delta = this.game.input.mouseDelta.divide(this.game._getResolution())
    this.threeObject.rotateX(delta.y)
    this.threeObject.rotateOnWorldAxis(WORLD_Y_AXIS, delta.x)

    if (this.game.input.keyDown('KeyW')) {
      this.threeObject.translateZ(-7 * dt)
    }

    if (this.game.input.keyDown('KeyS')) {
      this.threeObject.translateZ(7 * dt)
    }

    if (this.game.input.keyDown('KeyA')) {
      this.threeObject.translateX(-7 * dt)
    }

    if (this.game.input.keyDown('KeyD')) {
      this.threeObject.translateX(7 * dt)
    }
  }
}
