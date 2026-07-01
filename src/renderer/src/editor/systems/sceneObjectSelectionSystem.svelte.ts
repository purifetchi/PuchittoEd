import { MOUSE_LEFT, type Game } from 'puchitto'
import type { GameObject } from 'puchitto/objects'
import type { GameSystem } from 'puchitto/systems'
import { OutlinePass, type EffectComposer } from 'three/examples/jsm/Addons.js'
import {
  resetSelectedObject,
  selectionState,
  setSelectedObject
} from '../../state/selectionState.svelte'
import { GenericGizmo } from '../entities/gizmos/genericGizmo'
import type { EditorGame } from '../editorGame'
import { TransformsObject } from '../entities/transformsObject'

/**
 * The selection system for the scene.
 */
export class SceneObjectSelectionSystem implements GameSystem {
  /**
   * The game instance.
   */
  private _game!: EditorGame

  /**
   * The outline pass.
   */
  private _outlinePass: OutlinePass

  /**
   * The last selected object.
   */
  private _lastSelectedObject?: GameObject

  registerGame(game: Game): void {
    this._game = game as EditorGame

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

    // NOTE: Because we also need to check if we're intersecting with the axis handles
    //       we want to avoid selecting an object during the raycast. That's why we have to
    //       go through all of the intersections in order to find if any of them have been the
    //       axis handles, if we had any object selected before.

    let maybeNextSelectedObject: GameObject | undefined
    const intersections = this._game.raycast()
    for (const intersected of intersections) {
      let object = intersected.object
      while (object !== undefined && object.userData['id'] === undefined) {
        object = object.parent
      }

      if (object === null || object === undefined) {
        continue
      }

      const gameObject = this._game.getObjectById(object.userData['id'])
      if (!gameObject.visible) {
        continue
      }

      if (gameObject.tag === 'editor') {
        if (gameObject instanceof TransformsObject) {
          // Get the axis we're interested in. It's the name of the initial obj.
          const axisName = intersected.object.name
          gameObject.setHandlingAxis(axisName)
          return
        }
        continue
      }

      if (maybeNextSelectedObject === undefined) {
        maybeNextSelectedObject = gameObject
      }
    }

    this._setSelection(maybeNextSelectedObject)
  }

  /**
   * Sets the selection-based gizmos as visible for an object.
   * @param object The object to set the selection gizmos as visible for.
   * @param visible Whether they are visible.
   */
  private _setSelectionGizmosVisible(object: GameObject, visible: boolean): void {
    console.log(`Setting gizmos for ${object.name} to ${visible}`)
    const gizmos = this._game.getObjectGizmos(object)
    if (gizmos !== undefined && gizmos.length > 0) {
      for (const gizmo of gizmos) {
        if (gizmo.display === 'selected') {
          gizmo.setVisible(visible)
        }
      }
    }
  }

  /**
   * Sets the new selected object.
   * @param object The newly selected object.
   */
  private _setSelection(object: GameObject | undefined): void {
    if (this._lastSelectedObject !== undefined) {
      this._setSelectionGizmosVisible(this._lastSelectedObject, false)
    }

    if (object === undefined) {
      if (selectionState.id !== -1) {
        resetSelectedObject()
      }
      this._outlinePass.selectedObjects = []
      this._lastSelectedObject = object
      return
    }

    const actualObject = object instanceof GenericGizmo ? object.target : object
    if (selectionState.id !== actualObject.id) {
      setSelectedObject(actualObject)
    }

    this._outlinePass.selectedObjects = [actualObject.threeObject]

    this._setSelectionGizmosVisible(actualObject, true)
    this._lastSelectedObject = actualObject
  }
}
