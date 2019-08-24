<template>
  <v-container>
    <v-layout text-center wrap>
      <month-selector @date="onDateChange($event)"></month-selector>

      <v-select
        id="type-of-worker"
        :value="workerType"
        @input="setWorkerType($event)"
        :items="workerItems"
        :label="$t('typeOfWorker')"
        item-text="text"
        item-value="value"
      >
      </v-select>

      <v-btn @click="autoFill()">{{ $t("autoFill") }}</v-btn>
      <v-btn @click="clear()"> {{ $t("clear") }} </v-btn>

      <travel-table></travel-table>

      <v-btn @click="downloadAsExcel()">{{ $t("downloadAsExcel") }}</v-btn>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TravelTable from "@/components/TravelTable/TravelTable.vue";
import { downloadToExcel } from "@/components/TravelTable/ExcelExporter";
import { TravelTableModule } from "@/store/TravelTableModule";
import { getModule } from "vuex-module-decorators";
import MonthSelector from "@/components/TravelTable/MonthSelector.vue";
import { i18n } from "../main";
import { TypeOfWorker } from "@/components/TravelTable/TraveTable.interfaces";

@Component({
  components: {
    TravelTable,
    MonthSelector
  }
})
export default class Home extends Vue {
  store: TravelTableModule = getModule(TravelTableModule, this.$store);

  autoFill() {
    this.store.autoFillRows();
  }

  get workerItems() {
    return ["directors", "others"].map(value => {
      return { value, text: i18n.t(value) };
    });
  }

  get workerType() {
    return this.store.workerType;
  }

  setWorkerType(workerType: TypeOfWorker) {
    this.store.setWorkerType(workerType);
  }

  clear() {
    this.store.clearRows();
  }

  onDateChange(date: Date) {
    this.store.setDate(date);
  }

  downloadAsExcel() {
    downloadToExcel(
      { rows: this.store.rows, total: this.store.total },
      { workerType: this.store.workerType, date: this.store.date }
    );
  }
}
</script>
