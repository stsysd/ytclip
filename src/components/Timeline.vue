<template>
  <div class="timeline-container" ref="container">
    <teleport to="#layer">
      <div
        v-if="dragging != null"
        class="timeline-layer"
        :style="styles.layer"
        @mouseup="dragEnd"
        @mousemove="drag"
      />
    </teleport>
    <ruler
      v-if="ready"
      color="var(--ink-color)"
      :length="timelineWidth"
      :unit="ruler.unit"
      :labelRenderer="ruler.labeler"
      height="1.5em"
    />
    <div
      v-if="ready"
      class="timeline"
      ref="timeline"
      :style="styles.timeline"
      @mousedown="dragStart('current')"
    >
      <div class="video-range" :style="styles.videoRange" />
      <div class="clip-range" :style="styles.clipRange">
        <div
          class="left-handle"
          :style="styles.leftHand"
          @mousedown.stop="dragStart('start')"
        />
        <div
          class="right-handle"
          :style="styles.rightHand"
          @mousedown.stop="dragStart('end')"
        />
      </div>
      <div class="indicator current-time" :style="styles.currentTime"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import Ruler from "./Ruler.vue";

type Dragging = "start" | "end" | "current";

function waitForRendering() {
  const el = ref<HTMLElement>();
  const done = ref(false);
  const fn = () =>
    setTimeout(() => {
      if (el.value?.clientWidth) {
        done.value = true;
      } else {
        fn();
      }
    }, 1000 / 30);
  fn();
  return { el, done };
}

export default defineComponent({
  components: { Ruler },
  props: {
    duration: {
      type: Number,
      required: true
    },
    currentTime: {
      type: Number,
      required: true
    },
    clipStart: {
      type: Number,
      required: true
    },
    clipEnd: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      default: 48
    },
    scale: {
      type: Number,
      default: 1
    }
  },

  setup(props, { emit }) {
    const dragging = ref<Dragging | null>(null);
    const { el: container, done: ready } = waitForRendering();
    const timeline = ref<HTMLElement>();
    const time2pix = (t: number): number => Math.floor(t * props.scale);
    const pix2time = (p: number): number => Math.floor(p / props.scale);

    const timelineWidth = computed(() => {
      let w = time2pix(props.duration);
      if (container.value != null) {
        w = Math.max(w, container.value.clientWidth);
      }
      return w;
    });

    watch(
      () => props.scale,
      (_, prev) => {
        if (!container.value) return;
        const x = time2pix(props.currentTime);
        const v = Math.floor(props.currentTime / prev);
        container.value.scrollLeft += x - v;
      }
    );

    watch(
      () => props.currentTime,
      () => {
        if (!container.value) return;
        const x = time2pix(props.currentTime);
        if (x - 8 < container.value.scrollLeft) {
          container.value.scrollLeft = x - 8;
        } else if (
          x + 8 >
          container.value.scrollLeft + container.value.clientWidth
        ) {
          container.value.scrollLeft = x + 8 - container.value.clientWidth;
        }
      }
    );

    return {
      ready,
      container,
      dragging,
      timeline,
      drag(e: MouseEvent) {
        if (dragging.value == null) return;
        if (timeline.value == null) return;
        const rect = timeline.value?.getBoundingClientRect();
        let t = pix2time(Math.round(e.offsetX - rect.left));
        t = Math.max(0, t);
        t = Math.min(t, props.duration);
        if (dragging.value === "start") {
          emit("update:clipStart", t);
        } else if (dragging.value === "end") {
          emit("update:clipEnd", t);
        } else {
          emit("update:currentTime", t);
        }
      },
      dragStart(d: Dragging) {
        dragging.value = d;
      },
      dragEnd() {
        dragging.value = null;
      },
      timelineWidth,
      ruler: computed(() => {
        const spt = Math.pow(10, Math.floor(Math.log10(props.scale / 4)));
        const unit = props.scale / spt;
        const labeler = (i: number) => `${Math.round(i / spt)}`;
        return { unit, labeler };
      }),
      styles: computed(() => ({
        timeline: {
          width: `${timelineWidth.value}px`,
          height: `${props.height}px`
        },
        videoRange: {
          left: `0px`,
          width: `${time2pix(props.duration)}px`
        },
        clipRange: {
          left: `${time2pix(props.clipStart)}px`,
          width: `${time2pix(props.clipEnd - props.clipStart)}px`
        },
        currentTime: {
          left: `${time2pix(props.currentTime)}px`
        },
        layer: {
          cursor: dragging.value === "current" ? "pointer" : "w-resize"
        }
      }))
    };
  }
});
</script>

<style scoped>
.timeline-container {
  width: 100%;
  overflow-x: scroll;
  background-color: var(--light-shadow-color);
}

.timeline-container::-webkit-scrollbar {
  height: 8px;
  border-radius: 4px;
}
.timeline-container::-webkit-scrollbar-track-piece {
  background-color: var(--light-shadow-color);
}
.timeline-container::-webkit-scrollbar-thumb {
  background-color: var(--ink-color);
  border-radius: 4px;
  border: 1px solid transparent;
  width: 16px;
}

.timeline-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  cursor: w-resize;
}

.timeline {
  position: relative;
  overflow-x: hidden;
  background-color: white;
}

.video-range,
.clip-range {
  position: absolute;
  border-radius: 2px;
  top: 8px;
  bottom: 8px;
}

.video-range {
  background-color: var(--main-color);
  opacity: 0.5;
}

.clip-range {
  background-color: var(--main-color);
}

.left-handle,
.right-handle {
  z-index: 1;
  position: absolute;
  opacity: 0;
  height: 100%;
  top: 0;
  width: 17px;
  cursor: w-resize;
}

.left-handle {
  left: -8px;
}

.right-handle {
  right: -8px;
}

.indicator {
  position: absolute;
  height: 100%;
  width: 1px;
  top: 0;
}

.indicator.current-time {
  background-color: red;
}
</style>
