<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import { Color } from 'three'
  import ColorInput from '../../common/ColorInput.svelte'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let hex = $state('#ffffff')
  let accessor: () => Color
  let setter: (value: Color) => void

  let arrayToColor = (arr: number[]): Color => {
    return new Color(arr[0], arr[1], arr[2])
  }

  let colorToArray = (color: Color): number[] => {
    return [color.r, color.g, color.b]
  }

  $effect(() => {
    accessor = () => arrayToColor(obj[path])
    setter = (value: Color) => (obj[path] = colorToArray(value))

    hex = '#' + accessor().getHexString()
  })

  $effect(() => {
    const previous = '#' + accessor().getHexString()

    if (previous !== hex) {
      setter(new Color(hex))
    }
  })
</script>

<Property label={name}>
  <ColorInput bind:hex />
</Property>

<style>
</style>
