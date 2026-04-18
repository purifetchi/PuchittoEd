<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import type { SerializedMetadataProps } from 'puchitto/serialization'

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
    <div>{key}</div>
  {/each}
</div>

<style>
</style>
