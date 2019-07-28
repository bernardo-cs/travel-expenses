<template>
  <tr>
    <td>
      <button @click="$emit('clearRow')">X</button>
      <button @click="$emit('autoFillRow')">{{ $t("autoFill") }}</button>
    </td>
    <td>{{ day.getUTCDate() }} | {{ weekDay(day) }}</td>
    <td>
      <input
        type="text"
        :value="description"
        @input="descriptionChanged($event.target.value)"
      />
    </td>
    <td>
      <VueCtkDateTimePicker
        format="hh:mm a"
        formatted="hh:mm a"
        inputSize="sm"
        :minuteInterval="10"
        :onlyTime="true"
        :noLabel="true"
        :value="hours(departure)"
        @input="dateChanged('departureChanged', $event)"
      />
    </td>
    <td>
      <VueCtkDateTimePicker
        format="hh:mm a"
        formatted="hh:mm a"
        inputSize="sm"
        :minuteInterval="10"
        :onlyTime="true"
        :noLabel="true"
        :value="hours(arrival)"
        @input="dateChanged('arrivalChanged', $event)"
      />
    </td>
    <td>
      <input
        type="checkbox"
        :checked="sleepover"
        @mouseover="mouseOverCheckBox($event, 'sleepoverChanged')"
        @input="checkboxChanged('sleepoverChanged', $event.target.checked)"
      />
    </td>
    <td>
      <input
        type="checkbox"
        :checked="outsideCountry"
        @mouseover="mouseOverCheckBox($event, 'outsideCountryChanged')"
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
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";

@Component({ components: { VueCtkDateTimePicker } })
export default class TravelRow extends Vue {
  @Prop() public day!: Date;
  @Prop() public description!: Date;
  @Prop() public arrival!: Date;
  @Prop() public departure!: Date;
  @Prop() public sleepover!: boolean;
  @Prop() public outsideCountry!: boolean;

  hours(date: Date) {
    if (!date) {
      return date;
    }

    return moment(date).format("HH:mm a");
  }

  weekDay(date: Date) {
    return moment(date).format("ddd");
  }

  expense() {
    const outsideCountry = this.outsideCountry ? "outside" : "inside";

    return dailyExpenses(
      this.arrival,
      this.departure,
      this.sleepover,
      outsideCountry,
      this.$store.state.workerType
    );
  }

  descriptionChanged(description: string) {
    this.$emit("descriptionChanged", description);
  }

  dateChanged(event: string, timeInput: string) {
    if (!timeInput) {
      return this.$emit(event, timeInput);
    }

    const time = moment(timeInput, "HH:mm a");
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

  mouseOverCheckBox(event: any, eventName: string) {
    if (event.buttons == 1 || event.buttons == 3) {
      event.target.checked = !event.target.checked;
      this.$emit(eventName, event.target.checked);
    }
  }
}
</script>
