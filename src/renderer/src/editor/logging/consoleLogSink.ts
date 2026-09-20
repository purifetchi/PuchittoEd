import type { LoggingSink, LogSeverity } from 'puchitto/logging'
import { consoleState } from '../../state/consoleState.svelte'

/**
 * The max amount of log messages.
 */
export const MAX_MESSAGES: number = 50

/**
 * A logging sink that routes everything into the console view.
 */
export class ConsoleLogSink implements LoggingSink {
  onLogEvent(severity: LogSeverity, group: string, message: string): void {
    consoleState.messages.push({
      timestamp: new Date(),
      severity,
      group,
      message
    })

    if (consoleState.messages.length > MAX_MESSAGES) {
      consoleState.messages.shift()
    }
  }
}
