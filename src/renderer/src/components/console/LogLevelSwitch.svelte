<script lang="ts">
  import type { LogSeverity } from 'puchitto/logging'
  import { consoleState } from '../../state/consoleState.svelte'

  let {
    severity,
    name,
    enabled = $bindable()
  }: { severity: LogSeverity; name: string; enabled: boolean } = $props()

  const count = $derived(consoleState.messages.filter((x) => x.severity === severity).length)

  const onclick = (): void => {
    enabled = !enabled
  }
</script>

<button class="level-switch" class:on={enabled} {onclick}>
  <span
    class="dot"
    class:log={severity === 'log'}
    class:warn={severity === 'warn'}
    class:error={severity === 'error'}
  ></span>
  {name}
  <span class="count">{count}</span>
</button>

<style>
  .level-switch {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-muted);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    flex: none;
  }

  .level-switch.on {
    background: var(--bg-base);
    border-color: var(--border-color);
    color: var(--text-light);
  }

  .level-switch.on .count {
    color: var(--text-main);
  }

  .level-switch .count {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex: none;
  }

  .dot.log {
    background: var(--accent-hover);
  }

  .dot.warn {
    background: var(--warn);
  }

  .dot.error {
    background: var(--error);
  }
</style>
