import type { GizmoDefinition } from './entity/gizmoDefinition'
import type { SerializedPropertyDefinition } from './entity/serializedPropertyDefinition'

/**
 * A singular entity definition.
 */
export interface EditorEntityDefinition {
  /**
   * The JSON type of this entity.
   */
  type: string

  /**
   * The display name of the entity.
   */
  displayName: string

  /**
   * Is this entity a singleton?
   */
  singleton?: boolean

  /**
   * The group this entity belongs to.
   */
  group?: string

  /**
   * The serialized properties this entity has.
   */
  properties?: SerializedPropertyDefinition[]

  /**
   * The gizmos this entity has.
   */
  gizmos?: GizmoDefinition[]
}
