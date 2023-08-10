<script setup lang="ts">
import { ref, h } from 'vue';
import { NGrid, NGridItem, useMessage, NWatermark, NLayout, NLayoutSider, NIcon } from 'naive-ui';
import { usePositionStore } from '@/store/position';
import { useAircraftStore } from '@/store/aircraft';
import MyMenu from '@/components/MyMenu.vue';
import AirSider from '@/components/aircraft/AirSider.vue';
import AircraftMain from '@/components/aircraft/AircraftMain.vue';
import { useEditorStore } from '@/store/editor';

const editorStore = useEditorStore();
const message = useMessage();
const positionStore = usePositionStore();
const aircraftStore = useAircraftStore();

</script>

<template>
  <NWatermark show content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
  <MyMenu />
  <NLayout has-sider class="container">
    <NLayoutSider bordered width="18%" style="min-width: 260px;">
      <AirSider />
    </NLayoutSider>
    <NLayout class="main">
      <AircraftMain />
    </NLayout>
  </NLayout>
</template>

<style scoped>
.container {
  height: calc(90vh);
  width: calc(100vw);
  position: absolute;

  margin: 0;
  padding: 0;
}

.main {
  width: 100%;
  height: 100%;
}
</style>