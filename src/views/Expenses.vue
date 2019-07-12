<template>
  <div class="about">
    <h1>Travel Expenses</h1>

    <travel-table></travel-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TravelTable from "@/components/TravelTable/TravelTable.vue";

@Component({
  components: {
    TravelTable
  }
})
export default class Home extends Vue {}
</script>
