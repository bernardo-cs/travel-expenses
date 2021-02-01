<template>
  <div>
    <label>
      {{ $t("travelTable.years") }}
      <select
        @input="year = +$event.target.value"
        :value="year"
        name="years"
        id="years"
      >
        <option v-for="year in years" :key="year" :value="year">{{
          year
        }}</option>
      </select>
    </label>

    <label>
      {{ $t("sourceRetention.numberOfDependent") }}
      <select
        @input="numberOfDependent = +$event.target.value"
        :value="numberOfDependent"
        name="numberOfDependent"
        id="numberOfDependent"
      >
        <option
          v-for="numberOfDependent in [0, 1, 2, 3, 4, 5]"
          :key="numberOfDependent"
          :value="numberOfDependent"
          >{{ numberOfDependent === 5 ? "+" : "" }}
          {{ numberOfDependent }}</option
        >
      </select>
    </label>

    <label>
      {{ $t("sourceRetention.workerStatus") }}
      <select
        @input="workerStatus = $event.target.value"
        :value="workerStatus"
        name="workerStatus"
        id="workerStatus"
      >
        <option
          v-for="workerStatus in workerStatuses"
          :key="workerStatus"
          :value="workerStatus"
          >{{ $t(`sourceRetention.${workerStatus}`) }}</option
        >
      </select>
    </label>

    <label>
      {{ $t("sourceRetention.grossIncome") }}
      <input
        type="number"
        :value="grossIncome"
        @input="grossIncome = +$event.target.value"
      />
    </label>

    <ul>
      <li>{{ $t("sourceRetention.IRS") }}: {{ IRS }} €</li>
      <li>Net Income: {{ netIncome }} €</li>
      <li>Tier: {{ tier }}/{{ totalTiers }}</li>
      <li>Tax: {{ tax }} %</li>
    </ul>

    <IRSTable :table="IRSTable" :title="'Table'" :selectedRow="tier - 1" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  IRS,
  IRS_TABLE,
  WORKER_STATUS,
  WORKER_TYPE
} from "@/utils/calculators/irs";
import IRSTable from "@/components/IRSTable/IRSTable.vue";

@Component({ components: { IRSTable } })
export default class SourceRetention extends Vue {
  year: number = +Object.keys(IRS_TABLE)[0];
  numberOfDependent: number = 0;
  grossIncome: number = 0;
  workerStatus: WORKER_STATUS = WORKER_STATUS.NOT_MARRIED;

  tier?: number;
  totalTiers?: number;
  tax?: number;
  netIncome?: number;

  get years() {
    return Object.keys(IRS_TABLE);
  }

  get workerTypes() {
    return Object.keys(WORKER_TYPE);
  }

  get workerStatuses() {
    return Object.keys(WORKER_STATUS);
  }

  get IRS() {
    const { tier, tax, totalTiers, taxedIncome, netIncome } = IRS({
      grossIncome: this.grossIncome,
      numberOfDependent: this.numberOfDependent,
      year: this.year,
      workerStatus: this.workerStatus
    });

    this.tier = tier;
    this.totalTiers = totalTiers;
    this.tax = tax;
    this.netIncome = netIncome;

    return taxedIncome;
  }

  get IRSTable(): Array<[number, number]> {
    return IRS_TABLE[this.year][this.workerStatus].map(([income, ...taxes]) => [
      income,
      taxes[this.numberOfDependent]
    ]);
  }
}
</script>
