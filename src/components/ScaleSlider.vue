<template>
  <div class="x-cols pure-form x-grow">
    <button class="pure-button transparent" @click="volumeDown">
      <icon icon-name="search-minus" color="white" />
    </button>
    <input
      class="x-grow"
      type="range"
      v-model.number="internal_value"
      :min="internal_min"
      :max="internal_max"
      :step="step"
    />
    <button class="pure-button transparent" @click="volumeUp">
      <icon icon-name="search-plus" color="white" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Icon from "./Icon.vue";

export default defineComponent({
  components: { Icon },
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0.1
    },
    max: {
      type: Number,
      default: 10
    },
    step: {
      type: Number,
      default: 0.1
    },
    base: {
      type: Number,
      default: 2
    }
  },
  setup(props, { emit }) {
    const internal_value = computed({
      get(): number {
        return Math.log(props.modelValue) / Math.log(props.base);
      },
      set(v: number) {
        emit(
          "update:modelValue",
          Math.round(Math.pow(props.base, v) * 100) / 100
        );
      }
    });
    const internal_min = computed(
      () => Math.log(props.min) / Math.log(props.base)
    );
    const internal_max = computed(
      () => Math.log(props.max) / Math.log(props.base)
    );
    return {
      internal_value,
      internal_min,
      internal_max,
      volumeUp() {
        internal_value.value = Math.min(
          internal_max.value,
          internal_value.value + props.step
        );
      },
      volumeDown() {
        internal_value.value = Math.min(
          internal_max.value,
          internal_value.value - props.step
        );
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
