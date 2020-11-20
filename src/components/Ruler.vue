<template>
  <div class="ruler" :style="styles.ruler">
    <div class="long mark" :style="styles.longMark" />
    <div class="short mark" :style="styles.shortMark" />
    <div v-if="labelRenderer" class="label-group">
      <span
        v-for="i in count"
        :key="i"
        class="label"
        :style="styles.label((i - 1) * 10)"
      >
        {{ labelRenderer((i - 1) * 10) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
export default defineComponent({
  props: {
    color: {
      type: String,
      required: true
    },
    unit: {
      type: Number,
      default: 1
    },
    length: {
      type: Number,
      required: true
    },
    height: {
      type: [String, Number],
      required: true
    },
    labelRenderer: {
      type: Function as PropType<(index: number) => string>
    }
  },
  setup(props) {
    return {
      count: computed(() => Math.ceil(props.length / props.unit / 10)),
      styles: computed(() => ({
        ruler: {
          width: `${props.length}px`,
          height:
            typeof props.height === "number"
              ? `${props.height}px`
              : props.height
        },
        longMark: {
          background: `
          repeating-linear-gradient(
            90deg,
            ${props.color},
            ${props.color} 1px,
            transparent 0,
            transparent ${props.unit * 10}px
          )`
        },
        shortMark: {
          background: `
          repeating-linear-gradient(
            90deg,
            ${props.color},
            ${props.color} 1px,
            transparent 0,
            transparent ${props.unit}px
          )`
        },
        label(i: number) {
          return {
            left: `${props.unit * i}px`,
            color: props.color
          };
        }
      }))
    };
  }
});
</script>

<style scoped>
.ruler {
  margin: 0;
  padding: 0;
  border: none;
  position: relative;
  overflow: hidden;
}

.mark {
  position: absolute;
  left: 0px;
  width: 100%;
}

.long {
  height: 80%;
  bottom: 0px;
}

.short {
  height: 30%;
  bottom: 0px;
}

.label {
  position: absolute;
  top: 4px;
  font-size: 0.5em;
  padding: 0 2px;
}
</style>
