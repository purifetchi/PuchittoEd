import type { Game } from 'puchitto'
import type { Level, LevelEntityDefinition, LightData } from 'puchitto/level'
import type { GameObject } from 'puchitto/objects'
import type { SerializedMetadataProps } from 'puchitto/serialization'
import { AmbientLight, Color } from 'three'
import { PlaceholderObject } from '../entities/placeholderObject'

/**
 * Builds the serialized level data for a game.
 * @param game The game for which we're building the json level data.
 * @returns The built level data.
 */
export const buildLevelJsonData = (game: Game): Level => {
  const ents = buildEntityDefinitions(game)
  const ambient = buildAmbientInformation(game)

  return {
    version: 2,
    ambient,
    ents
  }
}

/**
 * Builds the ambient light information from the game.
 * @param game The game for which we're building the ambient light information.
 * @returns The built ambient light information.
 */
export const buildAmbientInformation = (game: Game): LightData => {
  let ambientLight: AmbientLight | undefined

  // TODO: Do not traverse, instead we should somehow store it on the game.
  game._scene.traverse((obj) => {
    if (obj instanceof AmbientLight) {
      ambientLight = obj as AmbientLight
    }
  })

  const color = ambientLight?.color ?? new Color('white')
  const intensity = ambientLight?.intensity ?? 1

  return {
    color: [color.r, color.g, color.b],
    intensity
  }
}

/**
 * Builds the entity definitions from the game.
 * @param game The game for which we're building the entity definitions.
 * @returns The built entity definitions.
 */
export const buildEntityDefinitions = (game: Game): LevelEntityDefinition[] => {
  return game._objects
    .filter((obj) => obj.tag !== 'internal' && obj.tag !== 'editor')
    .map((obj) => {
      let data: Record<string, unknown>
      let type: string

      if (obj instanceof PlaceholderObject) {
        type = obj.type
        data = obj.data
      } else {
        type = game._entityFactory.resolveType(obj)
        data = {}
        if (type === undefined) {
          throw new Error(`Cannot package object ${obj.constructor.name}, missing backtype.`)
        }

        const metadata = obj.constructor[Symbol.metadata]
        const serializedProps = metadata?.serializedProps as SerializedMetadataProps | undefined

        if (serializedProps !== undefined) {
          for (const [propName, path] of Object.entries(serializedProps)) {
            const key = propName as keyof GameObject
            data[path] = obj[key]
          }
        }
      }

      return {
        id: obj.id,
        name: obj.name,
        type: type,
        tag: obj.tag,
        antics: obj.antics.map((ant) => {
          return {
            on: ant.on,
            name: ant.name,
            script: ant.script.source
          }
        }),
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
