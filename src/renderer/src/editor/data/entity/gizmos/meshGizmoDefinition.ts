import type { BaseGizmoDefinition } from './baseGizmoDefinition'
import { type ColorRepresentation } from 'three'

/**
 * A definition of a mesh gizmo.
 */
export interface MeshGizmoDefinition extends BaseGizmoDefinition {
  type: 'mesh'
  path: string
  color: ColorRepresentation
}
