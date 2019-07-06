<template>
  <table>
    <thead>
      <tr>
        <th>Header content 1</th>
        <th>Header content 2</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td>Footer content 1</td>
        <td>Footer content 2</td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td>Body content 1</td>
        <td>Body content 2</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TravelTable extends Vue {
  @Prop() private msg!: string;
}
</script>