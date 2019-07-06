<template>
  <div>
    <input type="date" v-model="date" @input="$emit('date', $event.target.value)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MonthSelector extends Vue {
  date: string = new Date().toISOString().split("T")[0];
}
</script>
