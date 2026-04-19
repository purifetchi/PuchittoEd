import type { Game } from 'puchitto'
import type { Level, LevelEntityDefinition } from 'puchitto/level'
import type { GameObject } from 'puchitto/objects'
import type { SerializedMetadataProps } from 'puchitto/serialization'

export const buildLevelJsonData = (game: Game): Level => {
  const ents = buildEntityDefinitions(game)

  return {
    version: 2,
    ambient: {
      color: [0, 0, 0, 0],
      intensity: 0 // TODO
    },
    ents
  }
}

export const buildEntityDefinitions = (game: Game): LevelEntityDefinition[] => {
  return game._objects.map((obj) => {
    const metadata = obj.constructor[Symbol.metadata]
    const serializedProps = metadata?.serializedProps as SerializedMetadataProps | undefined

    const data: Record<string, unknown> = {}
    if (serializedProps !== undefined) {
      for (const [propName, path] of Object.entries(serializedProps)) {
        const key = propName as keyof GameObject
        data[path] = obj[key]
      }
    }

    return {
      id: obj.id,
      name: obj.name,
      type: 'todo',
      tag: obj.tag,
      antics: [], // TODO
      visible: obj.visible,
      transform: {
        position: [obj.transform.position.x, obj.transform.position.y, obj.transform.position.z],
        rotation: [
          obj.transform.rotation.x,
          obj.transform.rotation.y,
          obj.transform.rotation.z,
          obj.transform.rotation.z
        ],
        scale: [obj.transform.scale.x, obj.transform.scale.y, obj.transform.scale.z]
      },
      data
    }
  })
}
