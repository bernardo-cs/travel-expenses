<template>
  <tr>
    <td>{{ index }}</td>
    <td>Deslocações</td>
    <td>13</td>
    <td>18</td>
    <td>34,60</td>
  </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TravelRow extends Vue {
  @Prop() public index!: number;
}
</script>