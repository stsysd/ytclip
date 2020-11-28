<template>
  <div class="x-cols dense monotone">
    <button class="pure-button monotone" @click="emit('toggle')">
      <icon v-if="playing" icon-name="pause" />
      <icon v-else icon-name="play" />
    </button>
    <button class="pure-button monotone" @click="emit('seek-to-clip-start')">
      <icon icon-name="backward" />
    </button>
    <button class="pure-button monotone" @click="emit('seek-to-clip-end')">
      <icon icon-name="forward" />
    </button>
    <button class="pure-button monotone" @click="emit('set-clip-start')">
      <icon icon-name="arrow-left" />
    </button>
    <button class="pure-button monotone" @click="emit('set-clip-end')">
      <icon icon-name="arrow-right" />
    </button>
    <div class="x-grow centering"><slot /></div>
    <scale-slider
      :style="{ width: '240px' }"
      :modelValue="scale"
      @update:modelValue="updateScale"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "./Icon.vue";
import ScaleSlider from "./ScaleSlider.vue";

export default defineComponent({
  components: { Icon, ScaleSlider },
  props: {
    text: {
      type: String,
      default: ""
    },
    playing: {
      type: Boolean,
      required: true
    },
    scale: {
      type: Number,
      required: true
    }
  },
  setup(_, { emit }) {
    return {
      emit,
      updateScale(v: number) {
        emit("update:scale", v);
      }
    };
  }
});
</script>

<style scoped>
.x-cols.monotone.dense > * {
  border-radius: 0;
  color: white;
}
.x-cols.monotone.dense > *:not(:last-child) {
  border-right: solid 1px var(--shadow-color);
}
</style>
