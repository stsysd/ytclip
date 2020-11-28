<template>
  <div :class="drawerClasses">
    <icon :iconName="iconName" @click="onClick" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import Icon, { IconNames } from "./Icon.vue";

export default defineComponent({
  components: { Icon },
  props: {
    iconName: {
      type: String as PropType<IconNames>,
      required: true
    }
  },
  setup() {
    const opened = ref<boolean>(false);
    return {
      drawerClasses: computed(() => ({
        drawer: true,
        "x-cols": true,
        opened: opened.value
      })),
      onClick() {
        opened.value = !opened.value;
      }
    };
  }
});
</script>

<style scoped>
.drawer > .icon {
  color: var(--shadow-color);
}

.drawer.opened > .icon,
.drawer > .icon:hover {
  color: white;
}

.drawer > .content {
  overflow: hidden;
  transition: width 0.1s linear;
  width: 0;
}

.drawer.opened > .content {
  width: 120px;
}
</style>
