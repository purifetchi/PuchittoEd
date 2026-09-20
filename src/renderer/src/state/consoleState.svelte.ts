import type { LogSeverity } from 'puchitto/logging'

export type ConsoleMessage = {
  timestamp: Date
  severity: LogSeverity
  group: string
  message: string
}

export const consoleState = $state({
  messages: []
} as {
  messages: ConsoleMessage[]
})
