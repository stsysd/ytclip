<template>
  <div class="centering">
    <div class="x-rows">
      <div ref="container" class="screen"></div>
      <controller
        v-show="ready"
        :playing="isPlaying"
        @toggle="togglePlaying"
        @step-backward="stepBackward"
        @step-forward="stepForward"
        @seek-to-clip-start="seekToClipStart"
        @seek-to-clip-end="seekToClipEnd"
        @set-clip-start="setClipStart"
        @set-clip-end="setClipEnd"
      >
        [{{ clipStart }}-{{ clipEnd }}] {{ currentSeconds }}/{{ duration }}
      </controller>
      <timeline
        v-show="ready"
        :duration="duration"
        :currentTime="currentTime"
        :scale="scale"
        v-model:clipStart="clipStart"
        v-model:clipEnd="clipEnd"
        @update:currentTime="onUpdateCurrentTime"
      />
      <div class="x-cols sliders" v-show="ready">
        <scale-slider v-model="scale" />
        <volume-slider v-model="volume" />
      </div>
      <div class="x-cols pure-form bottom" :playing="isPlaying">
        <input type="text" v-model="title" style="width: 80%" />
        <button class="pure-button primary" @click="onClip">
          <icon icon-name="hand-scissors" />
          Clip!
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { usePlayer, PlayerState } from "../utils/usePlayer";
import Timeline from "./Timeline.vue";
import Controller from "./Controller.vue";
import VolumeSlider from "./VolumeSlider.vue";
import ScaleSlider from "./ScaleSlider.vue";
import Icon from "./Icon.vue";

export default defineComponent({
  components: {
    Timeline,
    Controller,
    VolumeSlider,
    ScaleSlider,
    Icon
  },
  props: {
    videoId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { container, ctrl } = usePlayer(props.videoId);

    const title = ref<string>("");
    const duration = ref<number>(0);
    const state = ref<PlayerState>("unstarted");
    const volume = ref<number>(0);
    const scale = ref<number>(1);
    const currentTime = ref<number>(0);

    const _clipStart = ref<number>(0);
    const clipStart = computed({
      get() {
        return Math.floor(Math.max(0, _clipStart.value));
      },
      set(value: number) {
        _clipStart.value = Math.max(0, value);
      }
    });

    const _clipEnd = ref<number>(Infinity);
    const clipEnd = computed({
      get() {
        return Math.ceil(Math.min(_clipEnd.value, duration.value));
      },
      set(value: number) {
        _clipEnd.value = Math.ceil(Math.min(value, duration.value));
      }
    });

    ctrl.once("ready", async e => {
      duration.value = e.duration;
      title.value = e.title;
      await ctrl.setVolume(volume.value);
    });

    ctrl.on("stateChange", e => {
      state.value = e.state;
    });

    ctrl.on("tick", ({ time }) => {
      if (state.value === "playing") {
        currentTime.value = time;
      }
    });

    ctrl.on("seeked", ({ time }) => {
      currentTime.value = time;
    });

    watch(volume, () => ctrl.setVolume(volume.value));

    return {
      emit,
      container,
      duration,
      currentTime,
      title,
      volume,
      scale,
      clipStart,
      clipEnd,
      currentSeconds: computed(() => Math.floor(currentTime.value)),
      ready: computed(() => duration.value > 0),

      isPlaying: computed(() => state.value === "playing"),
      togglePlaying() {
        if (state.value === "playing") {
          ctrl.pause();
        } else {
          ctrl.play();
        }
      },

      setClipStart() {
        clipStart.value = Math.floor(
          Math.min(clipEnd.value, currentTime.value)
        );
      },
      setClipEnd() {
        clipEnd.value = Math.floor(
          Math.max(clipStart.value, currentTime.value)
        );
      },
      stepBackward() {
        ctrl.seek(currentTime.value - 1, true);
      },
      stepForward() {
        // currentTime.value += 1;
        ctrl.seek(currentTime.value + 1, true);
      },

      seekToClipStart() {
        ctrl.seek(clipStart.value, true);
      },
      seekToClipEnd() {
        ctrl.seek(clipEnd.value, true);
      },
      onUpdateCurrentTime(t: number) {
        // currentTime.value = t;
        // ctrl.seek(currentTime.value, true);
        ctrl.seek(t, true);
      },
      onClip() {
        const e = {
          start: clipStart.value,
          end: clipEnd.value,
          videoId: props.videoId,
          title: title.value
        };
        emit("clip", e);
      }
    };
  }
});
</script>

<style scoped>
.centering > .x-rows {
  width: 80%;
  background-color: var(--ink-color);
  padding: 0;
  margin-bottom: 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.centering > .x-rows > * {
  box-sizing: border-box;
  width: 100%;
}

.screen {
  box-sizing: border-box;
  height: 360px;
  overflow: hidden;
}
.sliders {
  background-color: var(--shadow-color);
  padding: 0;
}
</style>
