import { MOUSE_RIGHT } from 'puchitto'
import { CameraObject, type GameObjectOptions } from 'puchitto/objects'
import { Vector3 } from 'three'

const WORLD_Y_AXIS = new Vector3(0, 1, 0)

export class EditorCameraObject extends CameraObject {
  constructor(opts: GameObjectOptions) {
    super(opts)
    this.tag = 'editor'
  }

  /**
   * Updates the editor camera's movement.
   */
  tick(dt: number): void {
    if (!this.game.input.cursorLocked) {
      if (this.game.input.mousePressed(MOUSE_RIGHT)) {
        this.game.input.lockCursor()
      }
      return
    }

    let movementMultiplier = 1
    if (this.game.input.keyDown('ShiftLeft')) {
      movementMultiplier = 3
    }

    if (this.game.input.keyDown('ControlLeft')) {
      movementMultiplier = 0.5
    }

    // Rotate the camera based on the delta!
    const delta = this.game.input.mouseDelta.multiplyScalar(0.5 * dt)
    this.threeObject.rotateX(-delta.y)
    this.threeObject.rotateOnWorldAxis(WORLD_Y_AXIS, -delta.x)

    if (this.game.input.keyDown('KeyW')) {
      this.threeObject.translateZ(-7 * dt * movementMultiplier)
    }

    if (this.game.input.keyDown('KeyS')) {
      this.threeObject.translateZ(7 * dt * movementMultiplier)
    }

    if (this.game.input.keyDown('KeyA')) {
      this.threeObject.translateX(-7 * dt * movementMultiplier)
    }

    if (this.game.input.keyDown('KeyD')) {
      this.threeObject.translateX(7 * dt * movementMultiplier)
    }
  }
}
