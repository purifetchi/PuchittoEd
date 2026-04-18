<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import type { SerializedMetadataProps } from 'puchitto/serialization'
  import Property from './Property.svelte'

  let { obj }: { obj: GameObject } = $props()

  let keys: string[] = $state([])

  $effect(() => {
    const metadata = obj.constructor[Symbol.metadata]
    const serializedProps = metadata?.serializedProps as SerializedMetadataProps | undefined

    if (serializedProps !== undefined) {
      keys = Object.keys(serializedProps)
    }
  })
</script>

<div>
  {#each keys as key, i (i)}
    <Property label={key}>
      <div>{obj[key]}</div>
    </Property>
  {/each}
</div>

<style>
</style>
