import type { GameObject } from 'puchitto/objects'
import { editor, type EditorGame } from '../../../editorGame'
import { HistoryCommand } from '../historyCommand'
import { PlaceholderObject } from '../../../entities/placeholderObject'
import type { SerializedMetadataProps } from 'puchitto/serialization'

/**
 * Gets the serialized data for an object.
 * @param obj The object.
 * @param type The type of the object.
 * @returns The serialized data.
 */
export const getSerializedDataForObject = (
  obj: GameObject,
  type: string
): Record<string, unknown> => {
  if (obj instanceof PlaceholderObject) {
    return obj.data
  } else {
    const data: Record<string, unknown> = {}
    if (type === undefined) {
      return data
    }

    const metadata = obj.constructor[Symbol.metadata]
    const serializedProps = metadata?.serializedProps as SerializedMetadataProps | undefined

    if (serializedProps !== undefined) {
      for (const [propName, path] of Object.entries(serializedProps)) {
        const key = propName as keyof GameObject
        data[path] = obj[key]
      }
    }

    return data
  }
}

export class EntityCreatedCommand extends HistoryCommand {
  private _id: number
  private _type: string
  private _name?: string
  private _data: Record<string, unknown>

  constructor(entity: GameObject) {
    super()
    this._id = entity.id
    this._type = editor._entityFactory.resolveType(entity)
    this._data = getSerializedDataForObject(entity, this._type)
  }

  get name(): string {
    return 'command.entityCreated'
  }

  undo(game: EditorGame): void {
    const object = game.getObjectById(this._id)
    this._name = object.name
    game.removeObject(object)
  }

  redo(game: EditorGame): void {
    const object = game._entityFactory.create(this._type, this._id, this._data)
    object.name = this._name
    game.addObject(object)
  }
}
