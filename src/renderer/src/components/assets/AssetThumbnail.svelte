<script lang="ts">
  import Box from '@lucide/svelte/icons/box'
  import AudioWaveform from '@lucide/svelte/icons/audio-waveform'
  import File from '@lucide/svelte/icons/file'
  import { deduceFormat } from '../../editor/helpers/formatHelpers'

  let { filename, size = 48 }: { filename: string; size: number } = $props()

  let format = $derived(deduceFormat(filename))

  let src = $derived(
    filename.startsWith('asset://') ? filename : `asset://${encodeURIComponent(filename)}`
  )
</script>

<span>
  {#if format === 'texture'}
    <img alt={filename} {src} width={size} height={size} />
  {:else if format === 'mesh'}
    <Box {size} />
  {:else if format === 'audio'}
    <AudioWaveform {size} />
  {:else}
    <File {size} />
  {/if}
</span>

<style>
</style>
