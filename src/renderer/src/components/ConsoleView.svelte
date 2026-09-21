<script lang="ts">
  import { Search, Trash } from '@lucide/svelte'
  import { consoleState, type ConsoleMessage } from '../state/consoleState.svelte'
  import LogLine from './console/LogLine.svelte'
  import { onMount } from 'svelte'
  import LogLevelSwitch from './console/LogLevelSwitch.svelte'

  let autoScroll: boolean = true
  let observer: MutationObserver
  let searchTopic: string = $state('')
  let log: HTMLDivElement = $state()

  let visibility = $state({
    log: true,
    warn: true,
    error: true
  })

  const clear = (): void => {
    consoleState.messages = []
  }

  const onscroll = (): void => {
    const distanceFromTop = log.scrollHeight - log.scrollTop - log.clientHeight

    autoScroll = distanceFromTop < 5
  }

  const isValid = (message: ConsoleMessage): boolean => {
    if (!visibility[message.severity]) {
      return false
    }

    if (searchTopic === undefined || searchTopic.length < 1) {
      return true
    }

    return message.group.includes(searchTopic) || message.message.includes(searchTopic)
  }

  onMount(() => {
    log.scrollTo({
      top: log.scrollHeight
    })

    observer = new MutationObserver(() => {
      if (!autoScroll) {
        return
      }

      log.scrollTo({
        top: log.scrollHeight,
        behavior: 'smooth'
      })
    })

    observer.observe(log, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  })
</script>

<div class="console">
  <div class="header">
    <button class="icon-button" onclick={clear}>
      <Trash size="16" />
    </button>
    <span class="separator"></span>
    <LogLevelSwitch severity="log" name="Log" bind:enabled={visibility.log} />
    <LogLevelSwitch severity="warn" name="Warn" bind:enabled={visibility.warn} />
    <LogLevelSwitch severity="error" name="Error" bind:enabled={visibility.error} />
    <span class="separator"></span>
    <div class="search">
      <span class="icon">
        <Search size="13" />
      </span>
      <input bind:value={searchTopic} placeholder="Filter messages... " />
    </div>
  </div>
  <div class="log" bind:this={log} {onscroll}>
    {#each consoleState.messages as message (message.timestamp)}
      {#if isValid(message)}
        <LogLine
          timestamp={message.timestamp}
          group={message.group}
          message={message.message}
          severity={message.severity}
        />
      {/if}
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

  .header .separator {
    width: 1px;
    height: 18px;
    background: var(--border-color);
    margin: 0 4px;
    flex: none;
  }

  .header .search {
    position: relative;
    flex: 1;
    gap: 7px;
    min-width: 90px;
    max-width: 260px;
    display: flex;
    align-items: center;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--text-light);
    padding: 4px 8px 4px 8px;
  }

  .header .search .icon {
    color: var(--text-muted);
  }

  .header .search input {
    background: none;
    border: none;
    font: inherit;
    flex: 1;
    color: var(--text-light);
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
