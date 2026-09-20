import type { LogSeverity } from 'puchitto/logging'

export const consoleState = $state({
  messages: []
} as {
  messages: {
    timestamp: Date
    severity: LogSeverity
    group: string
    message: string
  }[]
})
