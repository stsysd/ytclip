<template>
  <div class="x-cols">
    <button class="pure-button monotone" @click="emit('toggle')">
      <icon v-if="playing" icon-name="pause" />
      <icon v-else icon-name="play" />
    </button>
    <div class="pure-button-group" role="group">
      <button class="pure-button monotone" @click="emit('step-backward')">
        <icon icon-name="step-backward" />
      </button>
      <button class="pure-button monotone" @click="emit('step-forward')">
        <icon icon-name="step-forward" />
      </button>
    </div>
    <div class="pure-button-group" role="group">
      <button class="pure-button monotone" @click="emit('seek-to-clip-start')">
        <icon icon-name="backward" />
      </button>
      <button class="pure-button monotone" @click="emit('seek-to-clip-end')">
        <icon icon-name="forward" />
      </button>
    </div>
    <div class="x-grow"><slot /></div>
    <div class="pure-button-group" role="group">
      <button class="pure-button monotone" @click="emit('set-clip-start')">
        <icon icon-name="arrow-left" />
      </button>
      <button class="pure-button monotone" @click="emit('set-clip-end')">
        <icon icon-name="arrow-right" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "./Icon.vue";

export default defineComponent({
  components: { Icon },
  props: {
    text: {
      type: String,
      default: ""
    },
    playing: {
      type: Boolean,
      required: true
    }
  },
  setup(_, { emit }) {
    return { emit };
  }
});
</script>

<style scoped>
.x-cols {
  background-color: var(--shadow-color);
  color: white;
}
</style>
