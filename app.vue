<script setup lang="ts">
import { NConfigProvider, darkTheme, NGlobalStyle, NMessageProvider, NDialogProvider } from 'naive-ui';
</script>

<template>
  <NuxtLayout>
    <NConfigProvider :theme="darkTheme">
      <NGlobalStyle />
      <NMessageProvider>
        <NDialogProvider>
          <NuxtPage />
        </NDialogProvider>
      </NMessageProvider>
    </NConfigProvider>
  </NuxtLayout>
</template>