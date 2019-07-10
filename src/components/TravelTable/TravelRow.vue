<template>
  <tr>
    <td>{{ day.getUTCDate() }}</td>
    <td>{{ description }}</td>
    <td>{{ departure.getHours() }}</td>
    <td>{{ arrival.getHours() }}</td>
    <td>34,60</td>
  </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Moment } from "moment";

@Component
export default class TravelRow extends Vue {
  @Prop() public day!: Date;
  @Prop() public departure!: Date;
  @Prop() public description!: Date;
  @Prop() public arrival!: Date;
}
</script>