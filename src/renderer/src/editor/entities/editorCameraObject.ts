import type { CameraEntityData } from 'puchitto/level'
import { CameraObject, type GameObjectOptions } from 'puchitto/objects'
import { Vector3 } from 'three'

export class EditorCameraObject extends CameraObject {
  constructor(opts: GameObjectOptions & CameraEntityData) {
    super(opts)
  }

  /**
   * Updates the editor camera's movement.
   * @param dt The delta.
   */
  tick(dt: number): void {
    if (!this.game.input.mouseHeld) {
      return
    }

    // Rotate the camera based on the delta!
    const yAxis = new Vector3(0, 1, 0)
    const xAxis = new Vector3(1, 0, 0)
    const delta = this.game.input.mouseDelta
    this.threeObject.rotateOnWorldAxis(xAxis, delta.y * dt * 0.1)
    this.threeObject.rotateOnWorldAxis(yAxis, delta.x * dt * 0.1)
  }
}
