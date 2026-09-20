<script lang="ts">
  import { Trash } from '@lucide/svelte'
  import { consoleState } from '../state/consoleState.svelte'
  import LogLine from './console/LogLine.svelte'

  const clear = (): void => {
    consoleState.messages = []
  }
</script>

<div class="console">
  <div class="header">
    <button class="icon-button" onclick={clear}>
      <Trash size="16" />
    </button>
  </div>
  <div class="log">
    {#each consoleState.messages as message (message.timestamp)}
      <LogLine
        timestamp={message.timestamp}
        group={message.group}
        message={message.message}
        severity={message.severity}
      />
    {/each}
  </div>
</div>

<style>
  .console {
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 26px;
    height: 26px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-main);
    cursor: pointer;

    flex: none;
  }

  .header {
    display: flex;
    align-items: center;
    background: var(--bg-header);
    gap: 4px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .console .log {
    flex: 1;
    background-color: var(--bg-deep);
    font-family: var(--font-mono);
    font-size: 12px;
    min-height: 0;
    overflow-y: auto;
    user-select: text;
  }
</style>
