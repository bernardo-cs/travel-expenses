<template>
  <tr>
    <td>{{ day.getUTCDate() }} | {{ weekDay(day) }}</td>
    <td>{{ description }}</td>
    <td>
      <input
        type="time"
        :max="hours(arrival)"
        :value="hours(departure)"
        @input="$emit('departureChanged', $event.target.value)"
      />
    </td>
    <td>
      <input
        type="time"
        :min="hours(departure)"
        :value="hours(arrival)"
        @input="$emit('arrivalChanged', $event.target.value)"
      />
    </td>
    <td>34,60</td>
  </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Moment } from "moment";
import moment from "moment";

@Component
export default class TravelRow extends Vue {
  @Prop() public day!: Date;
  @Prop() public description!: Date;
  @Prop() public arrival!: Date;
  @Prop() public departure!: Date;

  hours(date: Date) {
    return moment(date).format("HH:mm");
  }

  weekDay(date: Date) {
    return moment(date).format("ddd");
  }
}
</script>