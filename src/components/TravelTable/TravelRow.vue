<template>
  <tr>
    <td>{{ day.getUTCDate() }} | {{ weekDay(day) }}</td>
    <td>{{ description }}</td>
    <td>
      <input
        type="time"
        :max="hours(arrival)"
        :value="hours(departure)"
        @input="dateChanged('departureChanged', $event.target.value)"
      />
    </td>
    <td>
      <input
        type="time"
        :min="hours(departure)"
        :value="hours(arrival)"
        @input="dateChanged('arrivalChanged', $event.target.value)"
      />
    </td>
    <td>{{ expense() }}</td>
  </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Moment } from "moment";
import { dailyExpenses } from "./DayExpenses";
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

  expense() {
    return dailyExpenses(
      this.arrival,
      this.departure,
      false,
      "inside",
      this.$store.state.workerType
    );
  }

  dateChanged(event: string, timeInput: string) {
    const time = moment(timeInput, "HH:mm");
    const dateTime = moment(this.day)
      .set({
        hour: time.get("hour"),
        minute: time.get("minute")
      })
      .toDate();

    this.$emit(event, dateTime);
  }
}
</script>