<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>VanillAlternative</span>
        <span class="font-weight-light">Travel Expenses</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text to="/expenses">
        <span class="mr-2">{{ $t("travelExpenses") }}</span>
      </v-btn>

      <v-btn text to="/about">
        <span class="mr-2">{{ $t("about.self") }}</span>
      </v-btn>

      <local></local>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Local from "./Local.vue";

@Component({ components: { Local } })
export default class App extends Vue {}
</script>
