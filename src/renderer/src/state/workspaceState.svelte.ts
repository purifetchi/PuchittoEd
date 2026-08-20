export const workspaceState = $state({
  hierarchyWidth: 260,
  inspectorWidth: 320
})

const MIN_WIDTH = 180
const MAX_WIDTH = 640

/**
 * Resizes a panel by some delta value.
 * @param panel The name of the panel to resize.
 * @param delta The delta of the resize.
 */
export const resizePanel = (panel: 'hierarchyWidth' | 'inspectorWidth', delta: number): void => {
  workspaceState[panel] = Math.max(MIN_WIDTH, Math.min(workspaceState[panel] + delta, MAX_WIDTH))
}
