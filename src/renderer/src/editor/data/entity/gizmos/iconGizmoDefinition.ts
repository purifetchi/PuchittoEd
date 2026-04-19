import type { BaseGizmoDefinition } from './baseGizmoDefinition'

/**
 * A definition of an icon gizmo.
 */
export interface IconGizmoDefinition extends BaseGizmoDefinition {
  type: 'icon'
  path: string
}
