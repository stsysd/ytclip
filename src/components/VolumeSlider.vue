<template>
  <div class="x-cols pure-form x-grow">
    <button class="pure-button transparent" @click="volumeDown">
      <icon icon-name="volume-down" color="white" />
    </button>
    <input
      class="x-grow"
      type="range"
      min="0"
      max="100"
      step="1"
      :value="modelValue"
      @input="onInput"
    />
    <button class="pure-button transparent" @click="volumeUp">
      <icon icon-name="volume-up" color="white" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "./Icon.vue";

export default defineComponent({
  components: { Icon },
  props: {
    modelValue: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    return {
      onInput(e: InputEvent) {
        emit("update:modelValue", parseInt((e.target as any).value));
      },
      volumeUp() {
        emit("update:modelValue", Math.min(props.modelValue + 1, 100));
      },
      volumeDown() {
        emit("update:modelValue", Math.max(0, props.modelValue - 1));
      }
    };
  }
});
</script>

<style scoped>
.x-cols {
  padding: 0.5em;
}
</style>
