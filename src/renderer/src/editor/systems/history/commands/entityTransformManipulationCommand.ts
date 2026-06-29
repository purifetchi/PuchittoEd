import type { GameObject } from 'puchitto/objects'
import { HistoryCommand } from '../historyCommand'
import { Quaternion, type Vector3 } from 'three'
import { recordCommand } from '../editorHistory'

/**
 * A historical recorded transform.
 */
export interface HistoryTransform {
  position: Vector3
  rotation: Quaternion
  scale: Vector3
}

/**
 * Packs a transform into a historical transform record.
 * @param entity The entity to pack the transform for.
 */
export const packTransform = (entity: GameObject): HistoryTransform => {
  return {
    position: entity.transform.position.clone(),
    rotation: entity.transform.rotation.clone(),
    scale: entity.transform.scale.clone()
  }
}

/**
 * Records all changes done to the entity.
 * @param entity The entity.
 * @param callback The callback modifying the state.
 */
export const recordTransformManipulation = (entity: GameObject, callback: () => void): void => {
  const prev = packTransform(entity)
  callback()
  const current = packTransform(entity)

  recordCommand(new EntityTransformManipulationCommand(entity, prev, current))
}

/**
 * A command recorded when manipulation an entity's transform.
 */
export class EntityTransformManipulationCommand extends HistoryCommand {
  /**
   * The entity we're manipulating.
   */
  private _entity: GameObject

  /**
   * The previous transform.
   */
  private _previous: HistoryTransform

  /**
   * The current transform.
   */
  private _current: HistoryTransform

  constructor(entity: GameObject, previous: HistoryTransform, current: HistoryTransform) {
    super()

    this._entity = entity
    this._previous = previous
    this._current = current
  }

  get name(): string {
    return 'command.transformManipulation'
  }

  undo(): void {
    this._applyTransform(this._previous)
  }

  redo(): void {
    this._applyTransform(this._current)
  }

  private _applyTransform(transform: HistoryTransform): void {
    this._entity.transform.position.copy(transform.position)
    this._entity.transform.rotation.copy(transform.rotation)
    this._entity.transform.scale.copy(transform.scale)
  }
}
