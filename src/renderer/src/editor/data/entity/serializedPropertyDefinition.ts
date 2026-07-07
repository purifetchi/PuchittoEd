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
  | 'enum'

/**
 * The visibility rule for a property
 */
export interface VisibilityRule {
  /**
   * The property we're matching against
   */
  property: string

  /**
   * The value it equals.
   */
  equals: unknown | unknown[]
}

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
   * The visibility rule for this property.
   */
  visibility?: VisibilityRule

  /**
   * Property hints. For example the minimum size, max size, etc.
   */
  hints?: Record<string, unknown>
}
