<template>
  <v-select
    id="month-selector"
    :value="items[monthIndex]"
    @input="setMonth($event)"
    item-text="text"
    item-value="value"
    :label="$t('travelTable.currentMonth')"
    :items="items"
  >
  </v-select>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";
import { i18n } from "@/main";

@Component
export default class MonthSelector extends Vue {
  @Prop() date!: Date;

  get monthIndex() {
    return moment(this.date).month();
  }

  get items() {
    return this.months.map(month => {
      const text = i18n.d(new Date(Date.UTC(0, month, 6, 6, 0, 0)), "month");
      return { text, value: month };
    });
  }

  get months(): Array<number> {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }

  setMonth(month: number) {
    this.$emit("date", moment(this.date).set("month", month));
  }
}
</script>
