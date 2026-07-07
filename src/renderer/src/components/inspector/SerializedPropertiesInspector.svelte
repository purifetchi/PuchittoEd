<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import type { SerializedPropertyDefinition } from '../../editor/data/entity/serializedPropertyDefinition'
  import NumberProperty from './properties/NumberProperty.svelte'
  import ColorProperty from './properties/ColorProperty.svelte'
  import InspectorPart from './InspectorPart.svelte'
  import BooleanProperty from './properties/BooleanProperty.svelte'
  import AssetReferenceProperty from './properties/AssetReferenceProperty.svelte'
  import EntityReferenceProperty from './properties/EntityReferenceProperty.svelte'
  import EnumProperty from './properties/EnumProperty.svelte'

  let { obj, props }: { obj: GameObject; props?: SerializedPropertyDefinition[] | undefined } =
    $props()

  /**
   * Calculates the property visibility.
   * @param prop The property definition.
   */
  const isVisible = (prop: SerializedPropertyDefinition): boolean => {
    if (prop.visibility === undefined) {
      return true
    }

    const vis = prop.visibility
    const val = obj[vis.property]
    if (Array.isArray(vis.equals)) {
      return vis.equals.includes(val)
    }

    return vis.equals === val
  }
</script>

<InspectorPart>
  {#each props as prop, i (i)}
    {#if isVisible(prop)}
      {#if prop.type === 'number'}
        <NumberProperty name={prop.displayName} {obj} path={prop.path} />
      {:else if prop.type === 'color'}
        <ColorProperty name={prop.displayName} {obj} path={prop.path} />
      {:else if prop.type === 'boolean'}
        <BooleanProperty name={prop.displayName} {obj} path={prop.path} />
      {:else if prop.type === 'assetReference'}
        <AssetReferenceProperty name={prop.displayName} {obj} path={prop.path} hints={prop.hints} />
      {:else if prop.type === 'entityReference'}
        <EntityReferenceProperty
          name={prop.displayName}
          {obj}
          path={prop.path}
          hints={prop.hints}
        />
      {:else if prop.type === 'enum'}
        <EnumProperty name={prop.displayName} {obj} path={prop.path} hints={prop.hints} />
      {:else}
        <div>Unknown property type {prop.type}</div>
      {/if}
    {/if}
  {/each}
</InspectorPart>

<style>
</style>
