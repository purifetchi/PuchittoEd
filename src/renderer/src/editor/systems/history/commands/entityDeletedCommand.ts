import type { GameObject } from 'puchitto/objects'
import { HistoryCommand } from '../historyCommand'
import { getSerializedDataForObject } from './entityCreatedCommand'
import { editor, type EditorGame } from '../../../editorGame'

export class EntityDeletedCommand extends HistoryCommand {
  private _id: number
  private _type: string
  private _name?: string
  private _data: Record<string, unknown>

  constructor(entity: GameObject) {
    super()
    this._id = entity.id
    this._name = entity.name
    this._type = editor._entityFactory.resolveType(entity)
    this._data = getSerializedDataForObject(entity, this._type)
  }

  get name(): string {
    return 'command.entityCreated'
  }

  undo(game: EditorGame): void {
    const object = game._entityFactory.create(this._type, this._id, this._data)
    object.name = this._name
    game.addObject(object)
  }

  redo(game: EditorGame): void {
    const object = game.getObjectById(this._id)
    game.removeObject(object)
  }
}
