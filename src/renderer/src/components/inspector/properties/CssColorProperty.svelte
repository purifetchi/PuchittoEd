<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import ColorInput from '../../common/ColorInput.svelte'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let value: string = $state('white')

  let accessor: () => string
  let setter: (value: string) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: string) => (obj[path] = value)

    value = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== value) {
      setter(value)
    }
  })
</script>

<Property label={name}>
  <ColorInput bind:hex={value} />
</Property>

<style>
</style>
