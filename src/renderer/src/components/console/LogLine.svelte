<script lang="ts">
  import type { LogSeverity } from 'puchitto/logging'

  let {
    timestamp,
    group,
    message,
    severity
  }: { timestamp: Date; group: string; message: string; severity: LogSeverity } = $props()
</script>

<div class="log-line" class:warn={severity === 'warn'} class:error={severity === 'error'}>
  <span class="timestamp">{timestamp.toLocaleTimeString('en-GB', { hour12: false })}</span>
  <span class="group">[{group}]</span>
  <span class="message">{message}</span>
</div>

<style>
  .log-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 2px 10px;
    border-left: 2px solid transparent;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .log-line:hover {
    background: var(--bg-base);
  }

  .log-line.warn {
    background: var(--bg-warn);
    color: var(--warn);
    border-left-color: var(--warn);
  }

  .log-line.error {
    background: var(--bg-error);
    color: var(--error);
    border-left-color: var(--error);
  }

  .log-line .timestamp {
    color: var(--text-muted);
  }

  .log-line .group {
    color: var(--accent-hover);
  }

  .log-line .message {
    flex: 1;
    min-width: 0;
  }
</style>
