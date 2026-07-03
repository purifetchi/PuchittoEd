import { RedoTool } from '../systems/history/tools/redoTool'
import { UndoTool } from '../systems/history/tools/undoTool'
import { registerTool } from '../systems/hotkey/hotkeyToolRegistrar'
import { CreateEntityTool } from './createEntityTool'
import { DeleteTool } from './deleteTool'
import { FindEntityTool } from './findEntityTool'
import { LookAtObjectTool } from './lookAtObjectTool'

/**
 * Registers all the tools.
 */
export const registerTools = (): void => {
  registerTool<UndoTool>(UndoTool)
  registerTool<RedoTool>(RedoTool)
  registerTool<LookAtObjectTool>(LookAtObjectTool)
  registerTool<DeleteTool>(DeleteTool)
  registerTool<CreateEntityTool>(CreateEntityTool)
  registerTool<FindEntityTool>(FindEntityTool)
}
