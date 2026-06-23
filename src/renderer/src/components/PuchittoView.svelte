<script lang="ts">
  import { onMount } from 'svelte'
  import { editor } from '../editor/editorGame'
  import { OfflineNetworkListener } from '../editor/offlineNetworkListener'
  import TransformToolbar from './scene/TransformToolbar.svelte'

  let container: HTMLElement

  onMount(async () => {
    editor.run({
      element: container,
      server: '',
      listenerFactory: () => new OfflineNetworkListener()
    })

    await editor.setReady()

    editor.newScene()
  })
</script>

<div id="puchitto-view" bind:this={container}>
  <TransformToolbar />
</div>

<style>
  #puchitto-view {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
    background: var(--bg-deep);
  }
</style>
