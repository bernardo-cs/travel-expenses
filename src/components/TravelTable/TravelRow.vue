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
    <td>
      <input type="checkbox" @input="checkboxChanged('sleepoverChanged', $event.target.checked)" />
    </td>
    <td>
      <input
        type="checkbox"
        @input="checkboxChanged('outsideCountryChanged', $event.target.checked)"
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
  @Prop() public sleepover!: boolean;
  @Prop() public outsideCountry!: boolean;

  hours(date: Date) {
    return moment(date).format("HH:mm");
  }

  weekDay(date: Date) {
    return moment(date).format("ddd");
  }

  expense() {
    const outsideCountry = this.outsideCountry ? "outside" : "inside";

    console.log(this.sleepover);
    return dailyExpenses(
      this.arrival,
      this.departure,
      this.sleepover,
      outsideCountry,
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

  checkboxChanged(event: string, value: boolean) {
    this.$emit(event, value);
  }
}
</script>