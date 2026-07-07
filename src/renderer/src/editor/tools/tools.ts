import { RedoTool } from '../systems/history/tools/redoTool'
import { UndoTool } from '../systems/history/tools/undoTool'
import { registerTool } from '../systems/hotkey/hotkeyToolRegistrar'
import { BringObjectToViewTool } from './bringObjectToViewTool'
import { CreateEntityTool } from './createEntityTool'
import { DeleteTool } from './deleteTool'
import { DuplicateEntityTool } from './duplicateEntityTool'
import { FindEntityTool } from './findEntityTool'
import { LookAtObjectTool } from './lookAtObjectTool'
import { SaveTool } from './saveTool'

/**
 * Registers all the tools.
 */
export const registerTools = (): void => {
  registerTool<UndoTool>(UndoTool)
  registerTool<RedoTool>(RedoTool)
  registerTool<LookAtObjectTool>(LookAtObjectTool)
  registerTool<BringObjectToViewTool>(BringObjectToViewTool)
  registerTool<DeleteTool>(DeleteTool)
  registerTool<CreateEntityTool>(CreateEntityTool)
  registerTool<FindEntityTool>(FindEntityTool)
  registerTool<SaveTool>(SaveTool)
  registerTool<DuplicateEntityTool>(DuplicateEntityTool)
}
