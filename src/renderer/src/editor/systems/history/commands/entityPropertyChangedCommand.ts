import type { GameObject } from 'puchitto/objects'
import { HistoryCommand } from '../historyCommand'

export class EntityPropertyChangedCommand extends HistoryCommand {
  private _entity: GameObject

  private _path: string
  private _previous: unknown
  private _current: unknown

  constructor(entity: GameObject, path: string, previous: unknown, current: unknown) {
    super()
    this._entity = entity
    this._path = path
    this._previous = previous
    this._current = current
  }

  get name(): string {
    return 'command.entityPropertyChanged'
  }

  undo(): void {
    if (this._entity) {
      this._entity[this._path] = this._previous
    } else {
      console.warn(`Trying to undo ${this._path} on a missing object!`)
    }
  }

  redo(): void {
    if (this._entity) {
      this._entity[this._path] = this._current
    } else {
      console.warn(`Trying to redo ${this._path} on a missing object!`)
    }
  }
}
