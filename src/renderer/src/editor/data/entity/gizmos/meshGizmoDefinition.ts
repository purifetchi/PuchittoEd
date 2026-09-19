import type { BaseGizmoDefinition } from './baseGizmoDefinition'

/**
 * A definition of a mesh gizmo.
 */
export interface MeshGizmoDefinition extends BaseGizmoDefinition {
  type: 'mesh'
  path: string
  scale: number
}
