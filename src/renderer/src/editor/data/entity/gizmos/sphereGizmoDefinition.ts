import type { BaseGizmoDefinition } from './baseGizmoDefinition'
import { type ColorRepresentation } from 'three'

/**
 * A definition of a sphere gizmo.
 */
export interface SphereGizmoDefinition extends BaseGizmoDefinition {
  type: 'sphere'
  path: string
  color: ColorRepresentation
}
