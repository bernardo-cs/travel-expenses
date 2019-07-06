<template>
  <div>
    <input type="date" v-model="date" @input="log($event.target.value)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MonthSelector extends Vue {
  date: string = new Date().toISOString().split("T")[0];

  log(e: any) {
    console.log(this.date, e);
  }
}
</script>
