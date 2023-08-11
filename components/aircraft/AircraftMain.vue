<script setup lang="ts">
import AircraftTask from '@/components/aircraft/AircraftTask.vue';
import AircraftResult from '@/components/aircraft/AircraftResult.vue';
</script>

<template>
  <div class="m-main">
    <AircraftTask />
    <AircraftResult />
  </div>
</template>

<style scoped>
.m-main {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>