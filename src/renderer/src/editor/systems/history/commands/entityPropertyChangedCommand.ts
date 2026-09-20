import { Logger } from 'puchitto/logging'
import type { GameObject } from 'puchitto/objects'
import { HistoryCommand } from '../historyCommand'

export class EntityPropertyChangedCommand extends HistoryCommand {
  private readonly _logger = new Logger('History', 'EntityPropertyChangedCommand')

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
      this._logger.warn(`Trying to undo ${this._path} on a missing object!`)
    }
  }

  redo(): void {
    if (this._entity) {
      this._entity[this._path] = this._current
    } else {
      this._logger.warn(`Trying to redo ${this._path} on a missing object!`)
    }
  }
}
