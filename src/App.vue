<template>
  <Toast />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Toast from 'primevue/toast'

export default defineComponent({
  name: 'App',
  components: {
    Toast
  }
})
</script>