/**
 * The type of the property.
 */
export type PropertyType =
  | 'vector3'
  | 'string'
  | 'boolean'
  | 'number'
  | 'color'
  | 'entityReference'
  | 'assetReference'

/**
 * Definition for a single serialized property.
 */
export interface SerializedPropertyDefinition {
  /**
   * The path of the property.
   */
  path: string

  /**
   * The display name of the property.
   */
  displayName: string

  /**
   * The property type.
   */
  type: PropertyType

  /**
   * Property hints. For example the minimum size, max size, etc.
   */
  hints?: Record<string, unknown>
}
