<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import type { SerializedPropertyDefinition } from '../../editor/data/entity/serializedPropertyDefinition'
  import NumberProperty from './properties/NumberProperty.svelte'
  import ColorProperty from './properties/ColorProperty.svelte'
  import InspectorPart from './InspectorPart.svelte'
  import BooleanProperty from './properties/BooleanProperty.svelte'
  import AssetProperty from './properties/AssetProperty.svelte'

  let { obj, props }: { obj: GameObject; props?: SerializedPropertyDefinition[] | undefined } =
    $props()
</script>

<InspectorPart>
  {#each props as prop, i (i)}
    {#if prop.type === 'number'}
      <NumberProperty name={prop.displayName} {obj} path={prop.path} />
    {:else if prop.type === 'color'}
      <ColorProperty name={prop.displayName} {obj} path={prop.path} />
    {:else if prop.type === 'boolean'}
      <BooleanProperty name={prop.displayName} {obj} path={prop.path} />
    {:else if prop.type === 'assetReference'}
      <AssetProperty name={prop.displayName} {obj} path={prop.path} />
    {/if}
  {/each}
</InspectorPart>

<style>
</style>
