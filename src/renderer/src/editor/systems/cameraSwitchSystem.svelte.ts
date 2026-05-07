import type { Game } from 'puchitto'
import type { GameSystem } from 'puchitto/systems'
import { selectionState } from '../../state/selectionState.svelte'
import { CameraObject } from 'puchitto/objects'
import type { EditorGame } from '../editorGame'

export class CameraSwitchSystem implements GameSystem {
  private _game: EditorGame

  /**
   * Is viewing as other camera?
   */
  private _viewingCamera: boolean

  /**
   * Registers the game.
   * @param game The game.
   */
  registerGame(game: Game): void {
    this._game = game as EditorGame
  }

  /**
   * Registers the effects for the effect composer.
   * @param composer The effect composer.
   */
  registerComposerEffects(): void {
    // ignored
  }

  /**
   * Ticks this system.
   * @param dt The delta time since the last frame.
   */
  tick(): void {
    const keyPressed = this._game.input.keyDown('KeyF')
    if (keyPressed && !this._viewingCamera) {
      // Check the current selection, is it a camera?
      const gameObject = this._game.getObjectById(selectionState.id)
      if (!(gameObject instanceof CameraObject)) {
        return
      }

      // Set as main camera!
      this._game.setMainCamera(gameObject)
      this._viewingCamera = true
    } else if (!keyPressed && this._viewingCamera) {
      this._game.setMainCamera(this._game.editorCamera)
      this._viewingCamera = false
    }
  }
}
