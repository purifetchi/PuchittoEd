import { Level } from 'puchitto/level'

export interface PuchittoAPI {
  selectProject: () => Promise<boolean>
  saveLevel: (level: Level) => Promise<boolean>
}
