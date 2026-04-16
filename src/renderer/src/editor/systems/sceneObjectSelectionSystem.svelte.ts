import { MOUSE_LEFT, type Game } from 'puchitto'
import type { GameObject } from 'puchitto/objects'
import type { GameSystem } from 'puchitto/systems'
import { OutlinePass, type EffectComposer } from 'three/examples/jsm/Addons.js'
import {
  resetSelectedObject,
  selectionState,
  setSelectedObject
} from '../../state/selectionState.svelte'

/**
 * The selection system for the scene.
 */
export class SceneObjectSelectionSystem implements GameSystem {
  /**
   * The game instance.
   */
  private _game!: Game

  /**
   * The outline pass.
   */
  private _outlinePass: OutlinePass

  registerGame(game: Game): void {
    this._game = game

    $effect(() => {
      if (selectionState.id === -1) {
        this._setSelection(null)
      } else {
        const object = this._game.getObjectById(selectionState.id)
        this._setSelection(object)
      }
    })
  }

  registerComposerEffects(composer: EffectComposer): void {
    this._outlinePass?.dispose()
    this._outlinePass = new OutlinePass(
      this._game._getResolution(),
      this._game._scene,
      this._game._camera.camera
    )

    composer.addPass(this._outlinePass)
  }

  tick(): void {
    if (this._game.input.cursorLocked) {
      return
    }

    if (!this._game.input.mousePressed(MOUSE_LEFT)) {
      return
    }

    const intersections = this._game.raycast()
    for (const intersected of intersections) {
      let object = intersected.object
      while (object.userData['id'] === undefined) {
        object = object.parent
      }

      if (object === null || object === undefined) {
        continue
      }

      const gameObject = this._game.getObjectById(object.userData['id'])
      this._setSelection(gameObject)
      return
    }

    this._setSelection(null)
  }

  private _setSelection(object: GameObject<unknown> | null): void {
    if (object === null) {
      resetSelectedObject()
      this._outlinePass.selectedObjects = []
      return
    }

    setSelectedObject(object)
    this._outlinePass.selectedObjects = [object.threeObject]
  }
}
