<template>
  <select
    id="local-selector"
    @input="setLocal($event.target.value)"
  >
    <option v-for="local in locals" :key="local" :value="local">{{ $t(local) }}</option>
  </select>
</template>

<script lang="ts">
import { Component, Vue} from "vue-property-decorator";
import { messages, i18n } from '../../main';

@Component
export default class Locale extends Vue {
  get locals() {
    return Object.keys(messages);
  }

  setLocal(local: string) {
    i18n.locale = local
  }
}
</script>
