<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <!-- Player -->
  <app-player />
  <auth-modal />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '@/components/Header.vue';
import AppPlayer from '@/components/Player.vue';
import AuthModal from '@/components/Auth.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    AppPlayer,
    AuthModal,
  },
  created() {
    this.$store.dispatch('initLogin');
  },
});
</script>

<style lang="stylus">

.fade-enter-from
  opacity 0

.fade-enter-active
  transition all 0.5s linear

.fade-leave-to
  transition all 0.5s linear
  opacity 0

</style>
