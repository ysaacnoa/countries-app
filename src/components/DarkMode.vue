<template>
  <q-btn
    class="bg-btn q-my-xs"
    :class="{ 'q-btn-dark-mode': isDarkMode }"
    :round="true"
    @click="toggleDarkMode"
  >
    <q-icon :name="isDarkMode ? 'fas fa-moon' : 'wb_sunny'" />
  </q-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DarkModeToggle extends Vue {
  isDarkMode = false;

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.$q.dark.set(this.isDarkMode);
    this.$emit('dark-mode', this.isDarkMode);
  }
}
</script>

<style scoped>
.bg-btn {
  background-color: #fff;
  color: #1976D2;
}

.q-btn-dark-mode {
  background-color: #333;
  color: #fff;
}
</style>