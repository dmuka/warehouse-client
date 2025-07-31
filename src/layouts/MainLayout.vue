<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Управление складом</h2>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="section-title">Склад</h3>
          <ul>
            <li v-for="route in stockRoutes" :key="route.path">
              <router-link :to="route.path">
                <i :class="route.meta.icon"></i>
                <span>{{ route.meta.title }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="section-title">Справочники</h3>
          <ul>
            <li v-for="route in referenceRoutes" :key="route.path">
              <router-link :to="route.path">
                <i :class="route.meta.icon"></i>
                <span>{{ route.meta.title }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const router = useRouter()

    const stockRoutes = computed(() => {
      return router.options.routes[0].children?.filter(
        route => route.path?.startsWith('/stock')
      ) || []
    })

    const referenceRoutes = computed(() => {
      return router.options.routes[0].children?.filter(
        route => route.path?.startsWith('/references')
      ) || []
    })

    return { stockRoutes, referenceRoutes }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/layout.scss' as layout;
</style>