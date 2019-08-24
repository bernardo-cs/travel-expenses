<template>
  <div style="width: 60px; height: 54px;">
    <v-select
      id="local-selector"
      @input="setLocal($event)"
      :value="local"
      :outlined="true"
      :items="locals"
      item-text="text"
      item-value="value"
    >
    </v-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { messages, i18n } from "@/main";

@Component
export default class LocaleSelection extends Vue {
  get local() {
    return i18n.locale;
  }

  get locals() {
    return Object.keys(messages).map(local => {
      const text = local === "pt" ? "🇵🇹" : "🇬🇧";
      return { text, value: local };
    });
  }

  setLocal(local: string) {
    i18n.locale = local;
  }
}
</script>
