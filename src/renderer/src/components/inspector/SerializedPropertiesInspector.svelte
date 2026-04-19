<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import type { SerializedPropertyDefinition } from '../../editor/data/entity/serializedPropertyDefinition'
  import NumberProperty from './properties/NumberProperty.svelte'

  let { obj, props }: { obj: GameObject; props?: SerializedPropertyDefinition[] | undefined } =
    $props()
</script>

<div>
  {#each props as prop, i (i)}
    {#if prop.type === 'number'}
      <NumberProperty name={prop.displayName} {obj} path={prop.path} />
    {/if}
  {/each}
</div>

<style>
</style>
